import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, {useState} from 'react'
import dayjs from 'dayjs'
import {Form, FormControl} from 'react-bootstrap'
import axios from 'axios'

export default function MyVerticallyCenteredModal(props) {
  const [file, setFile] = useState([])
  const [value, setValue] = useState('')
  const [value2, setValue2] = useState('')
  const [date, setDate] = useState('')
  let now = dayjs()

  const add = () => {
    const form = new FormData()
    form.append('title', value)
    form.append('text', value2)
    form.append('date', now.format('DD/MM/YYYY', 'es'))
    form.append('dateEnd', date)
    form.append('files', file[0])
    axios.post('http://0.0.0.0:4000/example/post', form)
      .then(({data}) => {
        console.log(data)
        setValue('')
        setDate('')
        setValue2('')
        props.add(data.item)
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
          Добавить задачу
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Названия задачи</h6>
        <FormControl value={value} onChange={event => setValue(event.target.value)} />
        <h6>Описания</h6>
        <FormControl value={value2} onChange={event => setValue2(event.target.value)} />
        <h6>Дата Окончания</h6>
        <FormControl value={date} onChange={event => setDate(event.target.value)} />
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Прикрипить файл</Form.Label>
          <Form.Control type="file" onChange={event => setFile(event.target.files)}/>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button className={'btn'} onClick={() => add()}>Добавить</Button>
      </Modal.Footer>
    </Modal>
  );
}
