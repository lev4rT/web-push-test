console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
    const data = e.data.json();
    console.log("Push Recieved...");
    self.registration.showNotification(data.title, {
        body: "Notification from OZON!",
        icon: "https://duckluckmarket.hb.bizmrg.com/svg/header/logo.svg"
    }).catch(err => console.log(err));
});