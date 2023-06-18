import { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'
import './App.css'

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16 
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app Departament of computire Science, University of helsinki</em>
    </div>
  )
}


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')// store the user-submitted input set it as the value attribute 
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happend...')

  // const hook = () => {
  //   console.log('effect')
  //   axios.get('http://localhost:3001/notes').then(response => {
  //     console.log('promise fulfilled')
  //     setNotes(response.data)
  //   })
  // }
  // useEffect(hook, []) 

  useEffect(() => {
    noteService.getAll().then(inialNotes => {
      setNotes(inialNotes)
    })
  }, [])

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: notes.lenght + 1,
    }
    
    noteService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService.update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    }).catch(error => {
      setErrorMessage(`Note ${note.content} was removed from server`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
      console.log(errorMessage)
    })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? ' important' : ' all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} /> )}
        {/*  the key attribute must now be defioned for the Note components, and not for the li tags */}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} /> 
        <button type='submit'>save</button>  
      </form>
      <Footer />
    </div>
  )
}

export default App 