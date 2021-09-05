// @ts-nocheck
class Watch {
    private chatInput: HTMLInputElement;
    private ws: WebSocket

    constructor() {
        let streamid = (document.getElementById("streamID") as HTMLInputElement).value;
        let courseid = (document.getElementById("courseID") as HTMLInputElement).value;
        this.ws = new WebSocket(`ws://localhost:8081/api/chat/c/${courseid}/s/${streamid}/ws`)
        this.chatInput = document.getElementById("chatInput") as HTMLInputElement
        this.ws.onmessage = function (m) {
            console.log(m.data);
            const data = JSON.parse(m.data);
            if ("viewers" in data && document.getElementById("viewerCount") != null) {
                document.getElementById("viewerCount").innerText = data["viewers"]
            } else if ("live" in data) {
                window.location.reload();
            } else if ("paused" in data) {
                const paused: boolean = data["paused"];
                console.log(paused);
                if (paused) {
                    window.dispatchEvent(new CustomEvent("pausestart"))
                } else {
                    window.dispatchEvent(new CustomEvent("pauseend"))
                }
            } else {
                const chatElem = Watch.createMessageElement(data)
                document.getElementById("chatBox").appendChild(chatElem)
                document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight
            }
        }

    }

    submitChat(e: Event) {
        e.preventDefault()
        this.ws.send(JSON.stringify({
            "msg": this.chatInput.value,
            "anonymous": (document.getElementById("anonymous") as HTMLInputElement).checked
        }))
        this.chatInput.value = ""
        return false//prevent form submission
    }

    /*
    while I'm not a fan of huge frontend frameworks, this is a good example why they can be useful.
     */
    private static createMessageElement(m): HTMLDivElement {
        // Header:
        let chatElem = document.createElement("div") as HTMLDivElement
        chatElem.classList.add("rounded", "p-2", "mx-2")
        let chatHeader = document.createElement("div") as HTMLDivElement
        chatHeader.classList.add("flex", "flex-row")
        let chatNameField = document.createElement("p") as HTMLParagraphElement
        chatNameField.classList.add("flex-grow", "font-semibold")
        if (m["admin"]) {
            chatNameField.classList.add("text-warn")
        }
        chatNameField.innerText = m["name"]
        chatHeader.appendChild(chatNameField)

        const d = new Date
        d.setTime(Date.now())
        let chatTimeField = document.createElement("p") as HTMLParagraphElement
        chatTimeField.classList.add("text-gray-500", "font-thin")
        chatTimeField.innerText = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)
        chatHeader.appendChild(chatTimeField)
        chatElem.appendChild(chatHeader)

        // Message:
        let chatMessage = document.createElement("p") as HTMLParagraphElement
        chatMessage.classList.add("text-gray-300", "break-words")
        chatMessage.innerText = m["msg"]
        chatElem.appendChild(chatMessage)
        return chatElem
    }
}

class Timer {

    constructor(date: string) {
        let d = new Date(date);
        d.setMinutes(d.getMinutes() - 10);
        this.countdown(d.getTime());
    }

    private countdown(countDownDate): void {
        // Update the count down every 1 second
        const x = setInterval(function () {

            // Get today's date and time
            const now = new Date().getTime();

            // Find the distance between now and the count down date
            const distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="demo"
            let out = ""
            if (days === 1) {
                out = "Live in one day";
            } else if (days > 1) {
                out = "Live in " + days + " days";
            } else {
                if (hours !== 0) {
                    out += hours.toLocaleString("en-US", {minimumIntegerDigits: 2}) + ":";
                }
                out += minutes.toLocaleString("en-US", {minimumIntegerDigits: 2}) + ":" + seconds.toLocaleString("en-US", {minimumIntegerDigits: 2})
            }
            document.getElementById("timer").innerText = out;

            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(x);
                document.getElementById("timer").innerText = "";
            }
        }, 1000);
    }
}

new Watch()

/*
 * Chat stuff:
 */

fetch("http://localhost:8081/api/chat/c/1/s/1/messages").then(response => response.json())
    .then(data => {
        messages.msgs = data;
        let event = new CustomEvent("messages-updated", {
            detail: {
                msgs: JSON.parse(JSON.stringify(messages.msgs)) // deep copy elem, otherwise alipne wouldn't pick up on it.
            }
        });
        window.dispatchEvent(event);
        document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight;
    });

function dispatchChange() {
    let event = new CustomEvent("messages-updated", {
        detail: {
            msgs: JSON.parse(JSON.stringify(messages.msgs)) // deep copy elem, otherwise alipne wouldn't pick up on it.
        }
    });
    window.dispatchEvent(event);
}

function orderVotes() {
    messages.msgs = messages.msgs.sort(function (a, b) {
        return b.votes - a.votes;
    });
    dispatchChange();
}

function orderTime() {
    messages.msgs = messages.msgs.sort(function (a, b) {
        return b.time - a.time;
    });
    dispatchChange();
}

function timeConverter(UNIX_timestamp) {
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    let sec = a.getSeconds();
    return hour + ':' + min;
}