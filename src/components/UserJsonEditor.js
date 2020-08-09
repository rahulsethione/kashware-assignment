import React from 'react';
import { JsonEditor } from 'jsoneditor-react';

export function UserJsonEditor() {

    const [userData, setUserData] = React.useState(null);
    const [notificationTest, setNotificationTest] = React.useState(null);
    const thumbnailRef = React.useRef(null);

    React.useEffect(() => {
        (async () => {
            const response = await fetch(process.env.REACT_APP_API_URL + "user/self", {
                mode: "cors",
                method: "GET",
                headers: { "Authorization": "Bearer " + localStorage.getItem("AUTH_TOKEN") }
            });

            const userJsonData = await response.json();

            setUserData(userJsonData);
        })();

        (async () => {
            const response = await fetch(process.env.REACT_APP_API_URL + "resources/protected/thumbnail.png", {
                mode: "cors",
                method: "GET",
                headers: { "Authorization": "Bearer " + localStorage.getItem("AUTH_TOKEN") }
            });

            const blob = await response.blob();

            thumbnailRef.current.setAttribute("src", URL.createObjectURL(blob));
        })();
    }, []);

    const onJsonChange = (event) => {
        setUserData({...userData, ...event});
    }

    const logout = () => {
        localStorage.removeItem("AUTH_TOKEN");
        window.location.reload();
    }

    const showNotification = (text, ms) => {
        setNotificationTest(text);
        setTimeout(() => setNotificationTest(null), ms)
    }

    const update = () => {
        (async () => {
            const response = await fetch(process.env.REACT_APP_API_URL + "user/self", {
                mode: "cors",
                method: "PUT",
                headers: { "Authorization": "Bearer " + localStorage.getItem("AUTH_TOKEN"), "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            const userJsonData = await response.json();

            setUserData(userJsonData);
            showNotification("Saved Successfully!", 2000);
        })();
    }

    return (
        <div className="container">
            <div style={{padding: "15px"}}>
                <a href="javascript:void(0)" onClick={logout} style={{float: "right", textDecoration: "none", display: "inline-block"}}>Logout</a>
            </div>
            <div style={{marginTop: "15px"}}>
            {userData !== null && <JsonEditor
                value={userData}
                onChange={onJsonChange}
            />}
            </div>
            <div style={{padding: "15px"}}>
                <button onClick={update}>Update</button>
                <span style={{margin: "0px 15px"}}>{notificationTest}</span>
            </div>
            <div style={{padding: "0px 15px"}}>
                <img src ref={thumbnailRef} width={120} height={100} />
            </div>
        </div>
    );
} 