import chalk from 'chalk'
import deepMapKeys from 'deep-map-keys'

const prefixForGatsbyKey = 'zwimlo_'
const restrictedNodeFields = ['id', 'fields', 'parent', 'children', 'internal']

/**
 * Validate the GraphQL naming convetions & protect specific fields.
 *
 * @param {any} key
 * @returns the valid name
 * Based on code from gatsby-source-filesystem - tx :-)
 */
const getValidKeyName = (key, verbose) => {
  let newKey = key
  let replaced = false

  const NAME_RX = /^[_a-zA-Z][_a-zA-Z0-9]*$/

  if (!NAME_RX.test(newKey)) {
    replaced = true
    newKey = newKey.replace(/-|__|:|\$|\.|\s/g, '_')
  }
  if (!NAME_RX.test(newKey.slice(0, 1))) {
    replaced = true
    newKey = `${prefixForGatsbyKey}${newKey}`
  }
  if (restrictedNodeFields.includes(newKey)) {
    replaced = true
    newKey = `${prefixForGatsbyKey}${newKey}`.replace(/-|__|:|\$|\.|\s/g, '_')
  }

  {
    replaced &&
      verbose &&
      console.log(
        `${chalk.magentaBright(
          'zwimlo',
        )} offending key: ${key} replaced by ${newKey}`,
      )
  }

  return newKey
}

// prepare json ids and fields to comply with Gatsby
const prepareKeys = (objects, verbose) =>
  deepMapKeys(objects, key => getValidKeyName(key, verbose))

export default prepareKeys
