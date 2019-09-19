import axios from 'axios'
import chalk from 'chalk'
import pluralize from 'pluralize'
import prepareKeys from './normalize'

export default async ({ siteId, apiType, objectType, accessToken, verbose }) => {
  console.time(`${chalk.cyan('zwimlo')} fetched ${objectType} items in`)

  const apiEndpoint = `https://${apiType}.zwimlo.com/v1/sites/${siteId}/${pluralize(objectType,)}`

  const documents = await pagedGet(apiEndpoint, accessToken, objectType, verbose)

  console.timeEnd(`${chalk.cyan('zwimlo')} fetched ${objectType} items in`)

  return {
    documents,
  }
}

// Tx to https://github.com/steniowagner @  https://github.com/axios/axios/issues/604
//  used for refDetails
const parseParams = params => {
  const keys = Object.keys(params)
  let options = ''

  keys.forEach(key => {
    const isParamTypeObject = typeof params[key] === 'object'
    const isParamTypeArray = isParamTypeObject && (params[key].length >= 0)

    if (!isParamTypeObject) {
      options += `${key}=${params[key]}&`
    }

    if (isParamTypeObject && isParamTypeArray) {
      params[key].forEach((element) => {
        options += `${key}=${element}&`
      })
    }
  })

  return options ? options.slice(0, -1) : options
}

const pagedGet = async (
  apiEndpoint,
  accessToken,
  objectType,
  verbose,
  offset = 0,
  limit = 50,
  aggregatedResponse = [],
) => {

  {verbose && console.log(`${chalk.magentaBright('zwimlo')} current offset: ${offset}`)}
  {verbose && console.log(`${chalk.magentaBright('zwimlo')} limit: ${limit}`)}

  {verbose &&
    axios.interceptors.request.use(request => {
      console.log('Starting Request', request)
      return request
    })
  }

  const response = await axios.get(apiEndpoint, {
    params: {
      offset: offset,
      limit: limit,
      ...(accessToken ? { access_token: accessToken } : {}),
      ...(objectType === 'content' ? { refDetails: ['ASSET','CONTENT'] } : {}),
    },
    paramsSerializer: params => parseParams(params)
  })

  if (!aggregatedResponse) {
    aggregatedResponse = response.data
  } else {
    aggregatedResponse = aggregatedResponse.concat(response.data)
  }

  if (offset + limit < response.headers['x-total-count']) {
    return pagedGet(apiEndpoint, accessToken, objectType, verbose, (offset += limit), limit, aggregatedResponse)
  }

  aggregatedResponse = prepareKeys(aggregatedResponse, verbose)

  console.log(`${chalk.black.bgCyan(' zwimlo ')} fetched successfully ${chalk.cyan(aggregatedResponse.length)} items`)

  return aggregatedResponse
}
