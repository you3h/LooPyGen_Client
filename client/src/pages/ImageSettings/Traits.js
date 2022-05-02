import { useState } from 'react'
import { Alert, Form, Divider, Upload, Select, Space, Input, Button, message } from 'antd'
import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'

import useStore from '../../store'
import { useLoader } from '../../hooks/useLoader'
import { PopoverColorPicker } from '../../components'

const { Option } = Select
const { Item } = Form

const CollectionDescription = ({ values }) => {
  const {
    collection_name: collectionName,
    artist_name: artistName,
    royalty_address: royaltyAddress,
    royalty_percentage: royaltyPercentage
  } = values

  return (
    <Alert
      description={<>
        <ul>
          <li>Collection Name: &emsp; <b>{collectionName}</b></li>
          {artistName && <li>Artist Name: &emsp; <b>{artistName}</b></li>}
          {royaltyAddress && <li>Royalty Address: &emsp; <b>{royaltyAddress}</b></li>}
          {royaltyAddress && <li>Royalty: &emsp; <b>{royaltyPercentage}%</b></li>}
        </ul>
        <span>Define number of traits and how many variation each will have</span>
      </>}
      type='info'
    />
  )
}

const BackgroundLayers = ({ savedColor, changeColor }) => {
  return (
  <>
    <Divider>Setup Background Colors</Divider>
    <Form.List name='backgrounds'>
      {(fields, { add, remove, move }) => (
          <>
            {fields.map(({ key, name, ...restField }, idx) => (
              <>
              <Divider>Color #{idx + 1}</Divider>
                <Space key={key} style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 8, justifyContent: 'space-between' }} align='baseline'>
                  <Item 
                    {...restField} 
                    name={[name, 'name']} 
                    label='Name' 
                    rules={[{ required: true }]}
                    tooltip={<span>Display Name: The pretty name of this variation</span>}
                  >
                    <Input placeholder='Color Display Name' />
                  </Item>
                  <Item 
                    {...restField} 
                    name={[name, 'rarity']} 
                    label='Rarity' 
                    rules={[{ required: true }]}
                    tooltip={<span>Rarity: How rare this variation is</span>}
                  >
                    <Select placeholder='Select rarity' style={{ minWidth: '115px' }}>
                      <Option value='4'>Common</Option>
                      <Option value='3'>Uncommon</Option>
                      <Option value='2'>Rare</Option>
                      <Option value='1'>Legendary</Option>                        
                    </Select>
                  </Item>
                  <Item 
                    {...restField} 
                    name={[name, 'color']} 
                    label='Color' rules={[{ required: true }]}
                    tooltip={<span>Color: The fill color of this background variation</span>}
                  >
                    <PopoverColorPicker color={savedColor[idx]} onChange={(color) => changeColor(color, idx)} />
                  </Item>
                  <DeleteOutlined onClick={() => {
                    delete savedColor[idx]
                    remove(name)
                  }} />
                </Space>
              </>
            ))}
            <Item>
              <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                Add Background
              </Button>
            </Item>
          </>
        )}
    </Form.List>
  </>
  )
}

const InitTraits = ({ traits, traitNames, setTraitNames, fileList, setFileList }) => {
  if (!traits) return null

  const traitsComponent = []

  for (let x = 0; x < traits; x++) {
    traitsComponent.push(
      <div key={x}>
        <Divider style={{ fontSize: '12px' }}>{traitNames && traitNames[x] ? `Setup - Trait ${traitNames[x]}` : ''}</Divider>
        <Item 
          name={['traits', `trait-${x}`]} 
          label='Name' 
          rules={[{ required: true, message: 'Trait name is required' }]}
          tooltip={<span>Display Name: The pretty name of this trait/layer</span>}
        >
          <Input 
            placeholder={`Trait #${x + 1} Display name`} 
            onChange={(e) => {
              setTraitNames({
                ...traitNames,
                [x]: e.target.value
              })
            }} 
          />
        </Item>
        <Variants 
          traitId={x} 
          traitNames={traitNames}
          fileList={fileList}
          setFileList={setFileList}
        />
      </div>
    )  
  }

  return traitsComponent
}

const Variants = ({ traitId, traitNames = {}, fileList, setFileList }) => {
  const traitName = traitNames[traitId]

  const uploadProps = (varId) => ({
    onRemove: () => {
      setFileList({
        ...fileList,
        [traitName + varId ]: undefined
      })

    },
    beforeUpload: file => {
        if (!traitNames[traitId]) {
        message.error('Add the trait name first before adding a filename')
        return false;
      }

      setFileList({
        ...fileList,
        [traitName + varId ]: {
          files: [file],
          filename: file.name
        }
      })
      
      return false;
    }
  })

  return (
    <Form.List name={`trait-${traitId}-variants`}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }, idx) => (
            <>
              <Divider>Variation #{idx + 1} {traitNames[traitId] ? `of ${traitNames[traitId]}` : '' }</Divider>
              <Space key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }} align='baseline'>
                <Item 
                  {...restField} 
                  name={[name, 'name']} 
                  label='Variant Name' rules={[{ required: true, message: 'Variant name is required' }]}
                  tooltip={<span>Display Name: The pretty name of this variation</span>}
                >
                  <Input 
                    placeholder={`Variation # ${idx + 1}`}
                  />
                </Item>
                <Item 
                  {...restField} 
                  name={[name, 'rarity']} 
                  label='Rarity' 
                  rules={[{ required: true, message: 'Rarity is required' }]}
                  tooltip={<span>Rarity: How rare this variation is</span>}
                >
                  <Select placeholder='Select rarity' style={{ minWidth: '115px' }}>
                    <Option value='4'>Common</Option>
                    <Option value='3'>Uncommon</Option>
                    <Option value='2'>Rare</Option>
                    <Option value='1'>Legendary</Option>                        
                  </Select>
                </Item>
                <Item 
                  {...restField} 
                  name={[name, 'filename']} 
                  label='File Name' 
                  rules={[{ required: true, message: 'File name is required' }]}
                  tooltip={<span>Filename: The exact name of the trait/layer file</span>}
                >
                  <Upload {...uploadProps(idx+1)} fileList={fileList[traitName+(idx+1)] ? fileList[traitName+(idx+1)].files : []}>
                    {
                      !(fileList[traitName+(idx+1)] && fileList[traitName+(idx+1)].filename) &&
                      <Button icon={<UploadOutlined />}>Select File</Button>
                    }
                  </Upload>
                </Item>
                <DeleteOutlined onClick={() => remove(name)} />
              </Space>
            </>
          ))}
          <Form.Item>
            <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
              {traitNames && traitNames[traitId] ? `Add Variation for ${traitNames[traitId]}` : 'Add Variation'}
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  )
}

const Traits = ({ form, values }) => {
  const { loader } = useLoader()
  const [traitNames, setTraitNames] = useState({})
  const [fileList, setFileList] = useState({})

  const {
    savedColor,
    setSavedColor
  } = useStore(state => ({
    savedColor: state.savedColor,
    setSavedColor: state.setSavedColor
  }))

  if (!values) return loader.show()

  const changeColor = (color, idx) => {
    setSavedColor({
      ...savedColor,
      [idx]: color
    })
  }

  return (
    <div style={{ width: '100%' }}>
      <CollectionDescription values={values} />
      <Form form={form} autoComplete='off'>
        { values && values.background && <BackgroundLayers savedColor={savedColor} changeColor={changeColor}/> }
        <Divider>Setup Traits</Divider>
        <InitTraits 
          traits={values && values.numOftraits} 
          traitNames={traitNames} 
          setTraitNames={setTraitNames}
          fileList={fileList}
          setFileList={setFileList}
        />
      </Form>
    </div>
  )
}

export default Traits
