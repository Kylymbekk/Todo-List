import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {FormControl} from 'react-bootstrap'
import React, {useState} from 'react'
import axios from 'axios'
import {useEffect} from 'react'

export default function MyVerticallyCenteredModalEdit(props) {
  const [value, setValue] = useState('')
  const [value2, setValue2] = useState('')
  const [dateEnd, setDateEnd] = useState('')

  const getExample = (id) => {
    axios.get('http://0.0.0.0:4000/example/edit', {
      params: {
        'id': id
      }
    })
      .then(({data}) => {
        setValue(data.data.title)
        setValue2(data.data.text)
        setDateEnd(data.data.dateEnd)
      })
      .catch(e => console.log(e))
  }

  useEffect(() => {
    if (props.id) {
      getExample(props.id)
    }
  }, [props.id])


  const changeTodo = () => {
    axios.post('http://0.0.0.0:4000/example/changeEdit', {
      id: props.id,
      title: value,
      text: value2,
      dateEnd: dateEnd,
    })
      .then((data) => {
        props.onChange(data.data.item)
      })
      .catch(e => console.log(e))
      .finally(() => {
        props.onHide()
      })
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Изменение задач
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Названия</h6>
        <FormControl value={value} onChange={event => setValue(event.target.value)} />
        <h6>Описания</h6>
        <FormControl value={value2} onChange={event => setValue2(event.target.value)} />
        <h6>Дата окончания</h6>
        <FormControl value={dateEnd} onChange={event => setDateEnd(event.target.value)} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => changeTodo()}>Сохранить</Button>
      </Modal.Footer>
    </Modal>
  );
}
