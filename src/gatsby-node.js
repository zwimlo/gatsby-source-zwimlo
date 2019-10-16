import chalk from 'chalk'
import crypto from 'crypto'
import { createRemoteFileNode } from 'gatsby-source-filesystem'
import _ from 'lodash'
import fs from 'fs'
import fetchData from './fetch'

exports.sourceNodes = async (
  { actions, store, cache, createNodeId, getNode },
  configOptions,
) => {
  const { createNode, createNodeField } = actions

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins

  // Consider options for delivery (content) or preview
  const apiType = configOptions.preview ? 'preview' : 'content'

  // Get an existing token from options for delivery or preview
  const optionAccessToken =
    apiType === 'preview'
      ? configOptions.previewToken
      : configOptions.deliveryToken

  // Enhance the token to a parameter if available
  const accessToken = optionAccessToken ? optionAccessToken : ''

  // Defines if the output is verbose or nearly silent
  const verbose = configOptions.verboseOutput

  const siteId = configOptions.siteId

  const objectTypes = ['asset', 'content']

  for (let type in objectTypes) {
    const objectType = objectTypes[type]

    {
      verbose &&
        console.log(
          `${chalk.magenta('zwimlo')} current objectType: ${objectType}`,
        )
    }

    const { documents } = await fetchData({
      siteId,
      apiType,
      objectType,
      accessToken,
      verbose,
    })

    await Promise.all(
      documents.map(async node => {
        const nodeId = createNodeId(`zwimlo-${objectType}-${node.zwimlo_id}`)
        const nodeType = `Zwimlo${_.upperFirst(objectType)}`

        {
          verbose &&
            console.log(
              `${chalk.magentaBright(
                'zwimlo',
              )} creating ${objectType} with ID: ${nodeId}`,
            )
        }
        {
          verbose &&
            console.log(
              `${chalk.magentaBright(
                'zwimlo',
              )} and gatsby node type: ${nodeType}`,
            )
        }

        const nodeContent = JSON.stringify(node)
        const nodeData = Object.assign({}, node, {
          id: nodeId,
          parent: null,
          children: [],
          internal: {
            type: nodeType,
            mediaType: `${
              objectType === 'asset'
                ? node.file.contentType
                : 'application/json'
            }`,
            contentDigest: crypto
              .createHash('md5')
              .update(nodeContent)
              .digest('hex'),
          },
        })

        createNode(nodeData)

        {
          verbose &&
            console.log(
              `${chalk.magentaBright('zwimlo')} nodeData ID: ${nodeData.id}`,
            )
        }

        const createdNode = getNode(nodeData.id)

        if (nodeType === `ZwimloAsset`) {
          const fileNode = await createRemoteFileNode({
            url: createdNode.file.url,
            store,
            cache,
            createNode,
            createNodeId,
          })

          console.log('createdNode', createdNode.zwimlo_id)

          {
            verbose &&
              console.log(
                `${chalk.magentaBright('zwimlo')} createdNode ID: ${
                  createdNode.id
                }`,
              )
          }
          {
            verbose &&
              console.log(
                `${chalk.magentaBright('zwimlo')} fileNode ID: ${fileNode.id}`,
              )
          }

          createdNode.relativePath___NODE = fileNode.id

          await createNodeField({
            node: fileNode,
            name: 'ZwimloAsset',
            value: createdNode.zwimlo_id,
          })

          {
            verbose &&
              console.log(
                `${chalk.magentaBright('zwimlo')} ${objectType} node created`,
              )
          }
        }
      }),
      fs.writeFile('test.json', documents),
    )
  }
  return
}
