let txt = document.getElementById("txt");
let basla = document.getElementById("basla");
let durdur = document.getElementById("durdur");
let seslendir = document.getElementById("seslendir");
let silTxt = document.getElementById("silTxt");
let gecmisKayitlar = document.getElementById("gecmisKayitlar");
let seslendirKayitlar = document.getElementById("seslendirKayitlar");
let gecmisTxt = document.getElementById("gecmisTxt");
let gecmisSil = document.getElementById("gecmisSil");
let silGecmis = document.getElementById("silGecmis");

let speech = new webkitSpeechRecognition();
speech.lang = "tr-tr";
speech.continuous = true;

basla.onclick = () => speech.start();
durdur.onclick = () => speech.stop();

speech.onresult = (event) => {
    let arr = event.results;
    let now = new Date();
    let timestamp = `[${now.toLocaleDateString()} ${now.toLocaleTimeString()}] `;
    getIpAddress().then(ip => {
        let yeniYazi = `${timestamp} - IP: ${ip} - ${arr[arr.length - 1][0].transcript}\n`;
        txt.value += yeniYazi;
        kayitEkle(yeniYazi);
    });
};

seslendir.onclick = () => {

    let utterance = new SpeechSynthesisUtterance(txt.value);
    speechSynthesis.speak(utterance);
};

silTxt.onclick = () => {
    txt.value = "";
};

gecmisKayitlar.onclick = () => {
    gecmisTxt.value = localStorage.getItem('gecmisKayitlar') || '';
};

seslendirKayitlar.onclick = () => {
    let gecmisKayitlar = gecmisTxt.value;
    let lines = gecmisKayitlar.split('\n');
    let mesajlar = lines.map(line => {
        let messageParts = line.split('-');
        return messageParts.length > 1 ? messageParts.slice(2).join('-').trim() : '';
    });
    let mesajlarText = mesajlar.join('\n');
    let utterance = new SpeechSynthesisUtterance(mesajlarText);
    speechSynthesis.speak(utterance);
};




silGecmis.onclick = () => {
    let confirmDelete = confirm("Geçmiş kayıtları silmek istediğinize emin misiniz? Eğer evete basarsanız geçmişteki tüm kayıtlarınız kalıcı olarak silinecektir.");
    if (confirmDelete) {
        localStorage.removeItem('gecmisKayitlar');
        gecmisTxt.value = '';
    }
};

function kayitEkle(yazi) {
    let gecmisKayitlar = localStorage.getItem('gecmisKayitlar') || '';
    gecmisKayitlar += yazi;
    localStorage.setItem('gecmisKayitlar', gecmisKayitlar);
}

async function getIpAddress() {
    try {
        const response = await fetch('https://api.ipify.org/?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.log(error);
        return '';
    }
}



let historyTextArea = document.getElementById("gecmisTxt");
let downloadHistoryButton = document.getElementById("downloadHistoryButton");

downloadHistoryButton.addEventListener("click", downloadHistory);

function downloadHistory() {
    let element = document.createElement("a");
    let file = new Blob([historyTextArea.value], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "Dmc Ses Kayıt.txt";
    element.click();
}

let konumbul = document.getElementById("konumbul");

konumbul.onclick = () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;


            let url = `https://ip-adresim.net/araclar/ip-yeri?enlem=${latitude}&boylam=${longitude}`;
            window.open(url, '_blank');
        }, error => {
            console.log(error);
        });
    } else {
        alert("Konum bilgisi bulunamadı.");
    }
};
