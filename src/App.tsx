import React, { useState, useEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components';
import produce from 'immer';
import { randomID } from './utils';
import { api } from './api';
import * as color from './color';
import { Header as _Header } from './Header';
import { Column } from './Column';
import { DeleteDialog } from './DeleteDialog';
import { Overlay as _Overlay } from './Overlay';

type Columns = {
  id: string
  title?: string
  text?: string
  cards?: {
    id: string
    text?: string
  }[]
}[]

function App() {
  const [columns, setColumns] = useState<Columns>([])

  useEffect(() => {
    ;(async () => {
      const columns = await api('GET /v1/columns', null)

      setColumns(columns)

      const unorderedCards = await api('GET /v1/cards', null)

      setColumns(
        produce((columns: Columns) => {
          columns.forEach(column => {
            column.cards = unorderedCards
          })
        }),
      )
    })()
  }, [])

  const [draggingCardID, setDraggingCardID] = useState<string | undefined>(
    undefined,
  )

  const dropCardTo = (toID: string) => {
    const fromID = draggingCardID
    if (!fromID) return

    setDraggingCardID(undefined)

    if (fromID === toID) return

    setColumns(
      produce((columns: Columns) => {
        const card = columns
          .flatMap(col => col.cards ?? [])
          .find(c => c.id === fromID)
        if (!card) return

        const fromColumn = columns.find(col =>
          col.cards?.some(c => c.id === fromID),
        )
        if (!fromColumn?.cards) return

        fromColumn.cards = fromColumn.cards.filter(c => c.id !== fromID)

        const toColumn = columns.find(
          col => col.id === toID || col.cards?.some(c => c.id === toID),
        )
        if (!toColumn?.cards) return

        let index = toColumn.cards.findIndex(c => c.id === toID)
        if (index < 0) {
          index = toColumn.cards.length
        }
        toColumn.cards.splice(index, 0, card)
      }),
    )
  }

  const setText = (columnID: string, value: string) => {
    setColumns(
      produce((columns: Columns) => {
        const column = columns.find(c => c.id === columnID)
        if (!column) return

        column.text = value
      }),
    )
  }

  const addCard = (columnID: string) => {
    const column = columns.find(c => c.id === columnID)
    if (!column) return

    const text = column.text
    const cardID = randomID()

    setColumns(
      produce((columns: Columns) => {
        const column = columns.find(c => c.id === columnID)
        if (!column) return

        column.cards?.unshift({
          id: cardID,
          text: column.text,
        })
        column.text = ''
      }),
    )

    api('POST /v1/cards', {
      id: cardID,
      text,
    })
  }

  const [deletingCardID, setDeletingCardID] = useState<string | undefined>(
    undefined,
  )
  const deleteCard = () => {
    const cardID = deletingCardID
    if (!cardID) return

    setDeletingCardID(undefined)

    setColumns(
      produce((columns: Columns) => {
        const column = columns.find(col => col.cards?.some(c => c.id === cardID),)
        if (!column) return

        column.cards = column.cards?.filter(c => c.id !== cardID)
      }),
    )
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header />

        <MainArea>
          <HorizontalScroll>
            {columns.map(({ id: columnID, title, cards, text }) => (
              <Column
                key={columnID}
                title={title}
                cards={cards}
                onCardDragStart={cardID => setDraggingCardID(cardID)}
                onCardDrop={entered => dropCardTo(entered ?? columnID)}
                onCardDeleteClick={cardID => setDeletingCardID(cardID)}
                text={text}
                onTextChange={value => setText(columnID, value)}
                onTextConfirm={() => addCard(columnID)}
              />
            ))}
          </HorizontalScroll>
        </MainArea>

        {deletingCardID && (
          <Overlay onClick={() => setDeletingCardID(undefined)}>
            <DeleteDialog
              onConfirm={deleteCard}
              onCancel={() => setDeletingCardID(undefined)}
            />
          </Overlay>
        )}
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

const Overlay = styled(_Overlay)`
  display: flex;
  justify-content: center;
  align-items: center;
`
export default App;
