import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Form, Alert, Radio, Input, Divider, InputNumber, Switch } from 'antd'

const CollectionContainer = styled.div`
  width: 100%
`
const InlineItemContainer = styled.div`
  display: flex;
  justify-content: ${props => props.alignment ? props.alignment : 'flex-start'};
  flex-wrap: wrap;
`

const VERTICAL_FORM_LAYOUT = { layout: 'vertical', autoComplete: 'off' }
const REQUIRED = message => ({ required: true, message })

const { Item } = Form
const { TextArea } = Input

const Collection = ({ form, values }) => {
  const [showThumbnail, setShowThumbnail] = useState(values && values.thumbnails)
  const [isAnimated, setIsAnimated] = useState(values && values.animation)
  const [withBackground, setWithBackground] = useState(values && values.background)
  
  useEffect(() => {
      if (!values) {
        form.setFieldsValue({
          'royalty_percentage': 1,
          numOftraits: 3,
          'animated_format': '.gif'
        })
      } else {
        form.setFieldsValue(values)
      }
  }, [values]) // eslint-disable-line

  const onChangeThumbnail = () => setShowThumbnail(!showThumbnail)
  const onChangeAnimated = () => setIsAnimated(!isAnimated)
  const onChangeWithBackground = () => setWithBackground(!withBackground)

  return (
    <CollectionContainer>
      <Alert description='Fill in the following collection and artist information' type='info'/>
      <Form form={form} {...VERTICAL_FORM_LAYOUT}>
        <Divider>Collection & Artist Information</Divider>
        <Item 
          name='collection_name' 
          label='Name' 
          rules={[ REQUIRED('Collection name is required') ]}
          tooltip={<span>Collection Name: A pretty name for your collection</span>}
        >
          <Input placeholder='Collection Name' />
        </Item>
        <Item 
          name='description' 
          label='Description' 
          rules={[ REQUIRED('Collection description is required') ]}
          tooltip={<span>Collection Description: A pretty description for your collection</span>}
        >
          <TextArea placeholder='Collection Description' />
        </Item>
        <Item 
          name='artist_name' 
          label='Artist Name'
          tooltip={<span>Artist Name: The name of the artist to show in the metadata [optional]</span>}
        >
          <Input placeholder='Artist Name (Optional, shown in metadata)' />
        </Item>
        <Item 
          name='royalty_address' 
          label='Royalty Address'
          tooltip={<span>Royalty Address: The address which will receive the royalties (L2, ENS or acccount ID) [optional]</span>}
        >
          <Input placeholder='Royalty Address (Optional)'/>
        </Item>  
        <InlineItemContainer alignment='space-between'>
          <Item 
            name='royalty_percentage' 
            label='Royalty Percentage' 
            rules={[{ type: 'number', min: 0, max: 10 }, REQUIRED('Royalty % is required')]}
            style={{  width: '30%' }}
            tooltip={<span>Royalty Percentage: Percentage of the price of a sale that will go to the Royalty Address</span>}
          >
            <InputNumber style={{ width: '100%' }} placeholder='0 - 10'/>
          </Item>   
          <Item 
            name='numOftraits' 
            label='# of Traits' 
            rules={[{ type: 'number', min: 1, max: 10 }, REQUIRED('# of Traits Required')]}
            style={{  width: '15%' }}
            tooltip={<span>Traits Count: How many traits will your NFT have (excluding background color)</span>}
          >
            <InputNumber style={{ width: '100%' }} placeholder='2+' />
          </Item>
          <Item 
            name='seed' 
            label='Seed' 
            style={{ width: '50%' }}
            tooltip={<span>Generation Seed: A seed for the random generator (use one for reproducible results) [optional]</span>}
          >
            <Input placeholder='Generation Seed (Optional)' />
          </Item>
        </InlineItemContainer>   
        <Divider>Others</Divider>
           <InlineItemContainer>
            <Item 
              name='background' 
              label='Generate Background' 
              style={{ width: '25%' }}
              tooltip={<span>Background Color: turn on the switch to specify a set of background fill colors</span>}
            >
              <Switch 
                onChange={onChangeWithBackground}
                checkedChildren='On'
                unCheckedChildren='Off'            
                defaultChecked={values && values.background} 
              />
            </Item>
            { withBackground &&
              <InlineItemContainer style={{ width: '75%' }}>
                <Item 
                  name='background_name' 
                  label='Layer Name' 
                  rules={[REQUIRED('Background name is required.')]} 
                  style={{ marginRight: '10px' }}
                  tooltip={<span>Display Name: The pretty name of this trait/layer</span>}
                >
                  <Input placeholder='Background Display Name' />
                </Item>
                <Item 
                  name='background_size_width' 
                  label='Background Width'
                  rules={[{ required: withBackground, message: 'Background width is required' }]}
                  style={{ marginRight: '10px' }}
                  tooltip={<span>Image width: The dimensions in pixels of your images width</span>}
                >
                  <Input placeholder='WIDTH' />
                </Item>
                <Item 
                  name='background_size_height' 
                  label='Background Height' 
                  tooltip={<span>Image height: The dimensions in pixels of your images width [optional]</span>}
                >
                  <Input placeholder='HEIGHT' />
                </Item>
              </InlineItemContainer>
            }
          </InlineItemContainer> 
          <InlineItemContainer>
            <Item 
              name='thumbnails' 
              label='Generate Thumbnail' 
              style={{ width: '25%' }}
              tooltip={<span>Thumbnails: turn on the switch to include a thumbnail in your NFTs for faster previews and widest compatibility with dAPPs</span>}
            >
              <Switch 
                onChange={onChangeThumbnail}
                checkedChildren='On'
                unCheckedChildren='Off'            
                defaultChecked={values && values.thumbnails}
              />
            </Item>
            { showThumbnail &&
              <>
                <Item 
                  name='thumbnail_size_width' 
                  label='Thumbnail Width'
                  rules={[{ required: showThumbnail, message: 'Thumbnail width is required' }]}
                  style={{ marginRight: '10px' }}
                  tooltip={<span>Thumbnail Width: The dimensions in pixels of your thumbnails width</span>}
                >
                  <Input placeholder='WIDTH' />
                </Item>
                <Item 
                  name='thumbnail_size_height' 
                  label='Thumbnail Height' 
                  tooltip={<span>Thumbnail height: The dimensions in pixels of your thumbnails height [optional]</span>}
                >
                  <Input placeholder='HEIGHT' />
                </Item>
              </>
            }
          </InlineItemContainer>          
          <InlineItemContainer>
            <Item 
              name='animation' 
              label='Animated Collection' 
              style={{ width: '25%' }}
              tooltip={<span>Animated collection: turn on the switch box to indicate that this collection contains animated traits (GIF, MP4 or WebM)</span>}
            >
              <Switch 
                onChange={onChangeAnimated}
                checkedChildren='On'
                unCheckedChildren='Off'            
                defaultChecked={values && values.animation} 
              />
            </Item>
            { isAnimated &&
              <Item 
                name='animated_format' 
                label='Animation Output Format' 
                rules={[{ required: isAnimated, message: 'Animated format is required' }]}
                tooltip={<span>Animated file format: The file format of your animated NFTs (does not affect thumbnails). GIF: quickest export, largest file. WebM: Slower export, small file. MP4: Slower export, small file, no transparency</span>}
              >
                <Radio.Group buttonStyle='solid' size='small'>
                  <Radio.Button value='.gif'>GIF</Radio.Button>
                  <Radio.Button value='.webm'>WEBM</Radio.Button>
                  <Radio.Button value='.mp4'>MP4</Radio.Button>
                </Radio.Group>
              </Item>
            }
          </InlineItemContainer>
      </Form>
    </CollectionContainer>
  )
}

export default Collection