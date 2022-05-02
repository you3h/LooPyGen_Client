import { useEffect, useState } from 'react'

const TraitsConfirmation = ({ values }) => {
  const [confValues, setConfValues] = useState({})

  useEffect(() => {
    const parseValues = () => {

      const tmpValues = values
      const { numOftraits } = tmpValues
      for(let x = 0; x < numOftraits; x++) {
        const variants = tmpValues['trait-'+x+'-variants']
        const tmpVariants = variants.map(variant => ({
          ...variant,
          filename: variant.filename.fileList[0].name
        }))
        tmpValues['trait-'+x+'-variants'] = tmpVariants
      }
      setConfValues(tmpValues)
    }
    parseValues()
  }, [values])

  return (
    <div style={{ overflow: 'auto', maxHeight: '70vh', width: '100%' }}>
      <h2>Pleas confirm the trait details:</h2>
      <pre>{JSON.stringify(confValues, null, '\t') }</pre>
    </div>
  )
}

export default TraitsConfirmation