import styled from 'styled-components'
import './App.less'

import { Home } from './pages'

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const App = () => {
  return (
    <Container>
      <Home />
    </Container>
  )
}

export default App
