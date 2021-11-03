import styled, { createGlobalStyle } from 'styled-components';
import * as color from './color';
import { Header as _Header } from './Header';
import { Column } from './Column';

function App() {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Header />

        <MainArea>
          <HorizontalScroll>
          <Column
            title="TODO"
            cards={[
              { id: 'a', text: '朝食をとる🍞' },
              { id: 'b', text: 'SNSをチェックする🐦' },
              { id: 'c', text: '布団に入る (:3[___]' },
            ]}
          />
          <Column
            title="Doing"
            cards={[
              { id: 'd', text: '顔を洗う👐' },
              { id: 'e', text: '歯を磨く🦷' },
            ]}
          />
          <Column title="Waiting" cards={[]} />
          <Column
            title="Done"
            cards={[{ id: 'f', text: '布団から出る (:3っ)っ -=三[＿＿]' }]}
          />
          </HorizontalScroll>
        </MainArea>
      </Container>
    </>
  )
}

const GlobalStyle = createGlobalStyle`
html, body, #app {
  height: 100%;
}

body {
  /* https://css-tricks.com/snippets/css/system-font-stack/ */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;

  overflow-wrap: break-word;
}
`

const Container = styled.div`
display: flex;
flex-flow: column;
height: 100%;
`

const Header = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
padding: 8px 16px;
background-color: ${color.Navy};
flex-shrink: 0;
color: ${color.Silver};
font-size: 16px;
font-weight: bold;
`
const MainArea = styled.div`
height: 100%;
padding: 16px 0;
overflow-y: auto;
`

const HorizontalScroll = styled.div`
display: flex;
width: 100%;
height: 100%;
overflow-x: auto;

> * {
  margin-left: 16px;
  flex-shrink: 0;
}

::after {
  display: block;
  flex: 0 0 16px;
  content: '';
}
`
export default App;
