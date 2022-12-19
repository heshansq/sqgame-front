import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { HubConnection, HubConnectionBuilder, IHttpConnectionOptions, LogLevel } from '@microsoft/signalr';
import { mainService } from "../../services/main.service";
import Header from "../../pages/Header";
import { formatFormData } from "../../helpers/helper";
import { Todo } from "../../models/todo.model";

const TodoManage = () => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>();
    const [newTask, setNewTask] = useState<any>();
    const [allTasks, setAllTasks] = useState<any[]>([]);

    useEffect(() => {
        let strUserData = localStorage.getItem('userdata');
        let userData;
        if (strUserData) {
            userData = JSON.parse(strUserData);
        } else {
            localStorage.removeItem('userdata');
            navigate('/');
        }

        setUserData(userData);
        //console.log('user data::', userData);
        //let accessToken = userData.token;
    }, [])

    useEffect(() => {
        if (userData?.user?.id) {
            mainService.getAllTodoByUser(userData?.user?.id).then((todoData: any) => {
                console.log('todoData:::', {todoData});
                setAllTasks(todoData?.data);
            }).catch((error: any) => {
                localStorage.removeItem('userdata');
                navigate('/');
            });
        }
    }, [newTask, userData])

    const submitTodo = (e: any) => {
        e.preventDefault();

        let formdata = formatFormData(e);
        let todo: Todo = { title: formdata?.title.toString(), desc: formdata?.desc.toString(), priority: parseInt(formdata?.priority.toString()), userid: userData?.user?.id };
        console.log('formdata::', todo);
        mainService.createTodo(todo).then(setNewTask).catch((err: any) => {
            navigate('/');
        });
    }
    
    const textSeverity = (severity: number) => {
        let textSev = '';

        switch(severity) {
            case 0:
                textSev = "Simple Severity";
                break;
            case 1:
                textSev = "Medium Severity";
                break;
            case 2:
                textSev = "High Severity";
                break;
            default:
                textSev = "Simple Severity";
                break;
        }
        return textSev;
    }

    const textStatus = (status: number) => {
        let textSt = '';

        switch(status) {
            case 0:
                textSt = "Pending";
                break;
            case 1:
                textSt = "Started";
                break;
            case 2:
                textSt = "Completed";
                break;
            default:
                textSt = "Pending";
                break;
        }
        return textSt;
    }

    const onStartTask = (todoTask: any, isComplete = false) => {
        let updateTodo: Todo;
        let status = 1;
        if (isComplete) {
            status = 2;
        }
        updateTodo = { id: todoTask?.id, title: todoTask?.title, desc: todoTask?.desc, priority: todoTask?.priority, status, userid: userData?.user?.id }

        mainService.updateTodo(updateTodo).then(setNewTask).catch((error: any) => {
            navigate('/');
        });
    }

    return (
        <>
            <Header/>
            <p>Todo</p>
            <div className="game-section">
                <h1>Add new Todo Item</h1>
               <form onSubmit={submitTodo}>
                <input required type="text" name="title" placeholder="Enter Todo Title"/>
                <textarea name="desc" required placeholder="Enter Description"></textarea>
                <div>
                    <span>Severity</span>
                    <label>
                        <input type="radio" name="priority" value="0"/>
                        <span>Light Weight</span>
                    </label>
                    <label>
                        <input type="radio" name="priority" value="1"/>
                        <span>Medium Weight</span>
                    </label>
                    <label>
                        <input type="radio" name="priority" value="2"/>
                        <span>Complex</span>
                    </label>
                </div>
                <input type="submit" value="Create new Task"/>
               </form>
               <div>
                {allTasks && allTasks.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <thead>
                            {allTasks.map((todoData: any, index: number) => {
                                return (
                                    <tr key={`todo-` + index}>
                                        <td>{todoData?.title}</td>
                                        <td>{todoData?.desc}</td>
                                        <td>
                                            {textSeverity(todoData?.priority)}
                                        </td>
                                        <td>
                                            {textStatus(todoData?.status)}
                                        </td>
                                        <td>
                                            {todoData?.status === 0 ? (
                                                <button onClick={() => onStartTask(todoData)}>Start</button>
                                            ) : todoData?.status === 1 ? (
                                                <button onClick={() => onStartTask(todoData, true)}>Complete</button>
                                            ) : null}
                                            <button>Update</button>
                                            <button disabled={todoData?.status === 2}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </thead>
                    </table>
                ) : null}
               </div>
            </div>
        </>
    );
}
export default TodoManage;