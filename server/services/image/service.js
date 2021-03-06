
const path = require('path')
const mkdirp = require('mkdirp')

const { logger, writeFile } = require('../../utils')
const { name, version } = require('../../package.json')
const { BadRequestError } = require('../../types/errors')

const SERVICE_NAME = '[IMAGE_SERVICE]'

class ImageService {
  async start () {
    // * Do Nothing
  }

  async stop () {
    // * Do Nothing
  }
  
  async healthCheck () {
    return {
      name,
      version,
      service: SERVICE_NAME,
      time: new Date().toISOString()
    }
  }

  async generateImageSettings (body) {
    const {
      collection_name,
      description,
      artist_name,
      thumbnails,
      animation,
      royalty_percentage,
      numOfTraits,
      background,
      backgrounds,
      background_name,
      background_size_width,
      background_size_height,
      royalty_address,
      seed,
      thumbnail_size_width,
      thumbnail_size_height,
      traits
    } = body

    const image_layers = []
    const rgba = {}
    const weights = []

    if (background) {
      backgrounds.forEach(background => {
        rgba[background.name] = Object.keys(background.color).map((obj, idx) => {

          if (idx === 3) {
            return Math.floor(background.color[obj] * 255)
          }
          
          return background.color[obj]
        })
        weights.push(parseInt(background.rarity))
      })

      image_layers.push({
        layer_name: background_name,
        variations: backgrounds.length,
        size: [
          parseInt(background_size_width),
          parseInt(background_size_height)
        ],
        rgba,
        weights
      })
    }

    if (traits) {
      Object.keys(traits).forEach(trait => {
        const traitName = traits[trait]
        const traitVariants = `${trait}-variants`

        const filenames = {}
        const weights = []

        body[traitVariants].forEach(tr => {
          filenames[tr.name] = tr.filename
          weights.push(parseInt(tr.rarity))
        })

        image_layers.push({
          layer_name: traitName,
          variations: body[trait+'-variants'].length,
          filenames,
          weights
        })
      })
    }

    const sanitizedName = collection_name
      .toLowerCase()
      .replace(/[^A-Za-z0-9 ]/g, '')
      .split(' ')
      .join('_')

    const parsedBody = {
      collection_name,
      collection_lower: sanitizedName,
      description,
      artist_name,
      thumbnails,
      animation,
      royalty_percentage,
      trait_count: numOfTraits,
      background_color: background,
      royalty_address,
      seed,
      image_layers,
      thumbnail_size: 
        thumbnails && thumbnail_size_width
          ? [
            parseInt(thumbnail_size_width),
            parseInt(thumbnail_size_height)
          ]
          : undefined
    }

    const commonPath = path.resolve('..', 'common', 'collections', sanitizedName, 'config')
    const traitsPath =  path.resolve('..', 'common', 'collections', sanitizedName, 'config', 'traits.json')
    
    try {
      await mkdirp(commonPath)
      await writeFile(traitsPath, JSON.stringify(parsedBody, null, '\t'))
      logger.info(`${SERVICE_NAME}: traits.json created`)
      return 'Successfully created a json config'
    } catch (err) {
      console.log(err)
      logger.error(`${err} - An error occured while writing JSON Object to File.`);
      throw new BadRequestError()
    }
}

}

module.exports = ImageService