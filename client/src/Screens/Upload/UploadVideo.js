import axios from "axios"
import React from "react";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Progress } from 'reactstrap';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const UploadVideo = () => {

    const [redirectStatus, setRedirectStatus] = useState(false)
    useEffect(() => {
        if (localStorage.getItem('userTokenTime')) {
            // Check if user holds token which is valid in accordance to time
            const data = JSON.parse(localStorage.getItem('userTokenTime'));
            if (new Date().getTime() - data.time > (1 * 60 * 60 * 1000)) {
                // It's been more than hour since you have visited dashboard
                localStorage.removeItem('userTokenTime');
                setRedirectStatus(true);
            }
        } else {
            setRedirectStatus(true);
        }
    }, [])


    const [selectedFile, setSelectedFile] = useState({
        file: null,
        loaded: 0
    });
    const [seletcedThumbnail, setSelectedThumbnail] = useState({ file: null });
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [isThumbnailPicked, setIsThumbnailPicked] = useState(false);
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();

    const changeHandler = (event) => {
        if (event.target.name === 'title') {
            return setTitle(event.target.value);
        }
        if (event.target.name === 'description') {
            return setDescription(event.target.value);
        }
        if (event.target.name === 'avatar') {
            setSelectedFile({ ...selectedFile, file: event.target.files[0] });
            setIsFilePicked(true);
            return;
        }
        if (event.target.name === 'thumbnail') {
            setSelectedThumbnail({ ...seletcedThumbnail, file: event.target.files[0] });
            setIsThumbnailPicked(true);
            return;
        }
    }
    const upload = async (e) => {

        const data = new FormData();
        data.append("avatar", selectedFile.file);
        data.append("thumbnail", seletcedThumbnail.file);
        data.append("title", title);
        data.append("description", description);

        console.log(data);
        axios.post("http://localhost:9002/uploadvideo", data, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userTokenTime')).token
            },
            onUploadProgress: ProgressEvent => {
                setSelectedFile({
                    ...selectedFile,
                    loaded: (ProgressEvent.loaded / ProgressEvent.total * 100)
                });
            }
        })
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })

    }

    function Todo({ todo, index, removeTodo }) {
        return (
            <>
                {todo.text}
                <div>
                    <button onClick={() => removeTodo(index)} className="text-slate text-base">x</button>
                </div>
            </>
        );
    }

    function TodoForm({ addTodo }) {
        const [value, setValue] = React.useState("");

        const handleSubmit = e => {
            e.preventDefault();
            if (!value) return;
            addTodo(value);
            setValue("");
        };

        return (
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="input"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
            </form>
        );
    }

    const [todos, setTodos] = React.useState([
    ]);

    const addTodo = text => {
        const newTodos = [...todos, { text }];
        setTodos(newTodos);
    };

    const removeTodo = index => {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
    };
    if (redirectStatus) return <Navigate to="/signIn" />
    return (
        <>
            <p className="text-4xl m-5">Video Upload</p>
            <div className="flex flex-col m-5 shadow-2xl bg-slate-100">
                <div className="text-2xl m-5">
                    Enter title: <br />
                    <input type="text" placeholder="Title" onChange={changeHandler} name="title" value={title} />
                </div>

                <div className="m-5">
                    <p className="text-2xl"> Upload thumbnail: </p>
                    <input type="file" name="thumbnail" onChange={changeHandler} />
                </div>

                <div className="m-5">
                    <p className="text-2xl">Upload Video file: </p>
                    <input type="file" name="avatar" onChange={changeHandler} />
                </div>

                <div className="text-2xl m-5">
                    Add Description: <br />
                    <input type="text" placeholder="Description" onChange={changeHandler} name="description" value={description} />
                </div>
                {isFilePicked ? (
                    <div>
                        <p>Filename: {selectedFile.file.name}</p>
                        <p>Filetype: {selectedFile.file.type}</p>
                        <p>Size in bytes: {selectedFile.file.size}</p>
                        <p>
                            lastModifiedDate:{' '}
                            {selectedFile.file.lastModifiedDate.toLocaleDateString()}
                        </p>
                    </div>
                ) : (
                    <p className="ml-5">Select a file to show details</p>
                )}
                <Progress max="100" color="success" value={selectedFile.loaded} className="m-5 mb-1">
                    {isNaN(Math.round(selectedFile.loaded, 2)) ? 0 : Math.round(selectedFile.loaded, 2)}%
                </Progress>

                <div className="text-2xl m-5">
                    Add tags:
                    <div className="app ml-5 text-lg">
                        <div className="todo-list">
                            {todos.map((todo, index) => (
                                <Todo
                                    key={index}
                                    index={index}
                                    todo={todo}
                                    removeTodo={removeTodo}
                                />
                            ))}
                            <TodoForm addTodo={addTodo} />
                        </div>
                    </div>
                </div>

                <button className="bg-[#002D74]  rounded-xl text-white py-2 hover:scale-105 duration-300 w-[10%] m-5 text-2xl" onClick={upload} >upload</button>
            </div>
        </>
    )
}

export default UploadVideo