import React, {useEffect, useState} from 'react'
import {Col, Container, Row, Button, FormControl, OverlayTrigger} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit, faTrash} from '@fortawesome/free-solid-svg-icons'
import MyVerticallyCenteredModal from './Modal'
import MyVerticallyCenteredModalEdit from './ModalEdit'
import Tooltip from 'react-bootstrap/Tooltip';
import axios from 'axios'

/**
 * Создания туду листь
 * Backend тоже ручной создал через python
 * Todolist.js Все задачи и описания.
 * Modal.js Здесь добавление задачи.
 * ModalEdit.js Редактирование задачи.
 */

function Todolist() {
  const [modalShowEdit, setModalShowEdit] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [value, setValue] = useState('')
  const [todo, setTodo] = useState([])

  const getExample = () => {
    axios.get('http://0.0.0.0:4000/example/get')
      .then(({data}) => {
        setTodo(data.data)
        console.log(data)
      })
      .catch(e => console.log(e))
  }

  useEffect(() => {
    getExample()
  }, [])


  const dell = (id) => {
    axios.delete('http://0.0.0.0:4000/example/delete', {
      params: {
        'id': id
      }
    })
      .then((data) => {
        if (data.data.status === 'success'){
          let newTodo = todo.filter((item) => item.id !== id)
          setTodo(newTodo)
        }
        console.log(data)
      })
      .catch(e => console.log(e))
  }

  const setDone = (done, id) => {
    axios.post('http://0.0.0.0:4000/example/done', {
      id: id,
      done: done
    })
      .then((data) => {
        setTodo(p => {
          return p.map(g => {
            if (g.id === id) {
              return {...g, isDone: done}
            }
            return g
          })
        })
      })
      .catch(e => console.log(e))
  }

  return (
    <Container>
        <div className='root'>TODO LIST</div>
        <Row className={'mt-2'}>
          <Col className='addTodoForm'>
            <FormControl disabled={true} value={value} onChange={event => setValue(event.target.value)} />
            <Button variant="primary" onClick={() => setModalShow(true)}>
              Добавить задачу
            </Button>
            <MyVerticallyCenteredModal
              show={modalShow}
              onHide={() => setModalShow(false)}
              add={(v) => {
                setTodo(p => {
                  return [v, ...p]
                })
              }}
            />
          </Col>
        </Row>

      <MyVerticallyCenteredModalEdit
        id={modalShowEdit}
        show={!!modalShowEdit}
        onHide={() => setModalShowEdit(null)}
        onChange={(v) => {
          setTodo(p => {
            return p.map(g => {
              if (g.id === v.id) {
                return v
              }
              return g
            })
          })
        }}
      />

        <div>
          {
            todo.length > 0 ?
              todo.map((item) => {
                  return (
                    <div key={item.id} className={'listItems'} style={{backgroundColor: item.isDone ? 'grey': 'white'}}>
                      <input type={'checkbox'} checked={item.isDone} onChange={(event) => setDone(event.target.checked, item.id)} className={'mx-2'}/>
                      <span>Названия: {item.title}</span>
                      <OverlayTrigger
                        placement={'bottom'}
                        overlay={
                          <Tooltip id={`tooltip-${item.id}`}>
                            <p>{item.text}</p>
                          </Tooltip>
                        }
                      >
                        <p>Описания</p>
                      </OverlayTrigger>
                      <p style={{marginLeft: '30px'}}>Дата: {item.date}</p>
                      <p>Дата окончания: {item.dateEnd}</p>
                      <p>Файл: {item.files}</p>
                        <div>
                          <Button variant="primary" onClick={() => setModalShowEdit(item.id)} style={{marginTop: '3px'}}>
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button onClick={() => dell(item.id)} style={{marginTop: '3px'}}><FontAwesomeIcon icon={faTrash}/></Button>
                        </div>
                    </div>
                  )
                }) :
              <h3 style={{display: 'flex', color:'#009999', justifyContent: 'center', alignItems: 'center', marginTop: '50px'}}>Нет задачи</h3>
          }
        </div>
    </Container>
  )
}

export default Todolist
