type Notify = {
    title: string,
    card: {
        body: string,
        tag: string,
    }
}

const notificate = (data: any) => {

    const notificate:Notify = {
        title: data.name,
        card:
        {
            body: "Students is valid",
            tag: data.reg,
        }
    };

    if (!("Notification" in window)) {
        
        alert("This browser does not support desktop notification");
    }

    else if (Notification.permission === "granted") {
        const notification = new Notification( notificate.title, notificate.card )
        return ;
    }

    else if (Notification.permission !== "denied") {  
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") 
                {const notification = new Notification( notificate.title, notificate.card )}
            
        })
    }
}
 
export default notificate;