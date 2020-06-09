const POPUP_CONF_DEFAULT = {
    dimensionClass: 'popup-600-800',
    displayCloseButton: true,
    coverBackground: 'darkgrey',
    coverOpacity: '95%',
    coverCloseOnClick: true
};

const POPUP_CONF_BLANK_300_300 = {
    dimensionClass: 'popup-300-300',
    displayCloseButton: false,
    coverBackground: 'white',
    coverOpacity: '100%',
    coverCloseOnClick: false
};

const POPUP_CONF_500_500 = {
    dimensionClass: 'popup-500-500',
    displayCloseButton: true,
    coverBackground: 'lightblue',
    coverOpacity: '95%',
    coverCloseOnClick: true
};

let popupConfActive = null;

const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout));

function initPopup() {
    const popupHtml = /*html*/`
        <div id="backgroundCover" style="display: none;"></div>
        <div id="popup" class="popup" style="display: none;">
            <div id="popupContent" style="display: none;">
                <div id="popupTopBar" style="display: none;">
                    <a href="javascript:closePopup()">
                        <svg height="20" width="20">
                            <line x1="0" y1="0" x2="20" y2="20" style="stroke:darkblue;stroke-width:2" />
                            <line x1="0" y1="20" x2="20" y2="0" style="stroke:darkblue;stroke-width:2" />
                        </svg>
                    </a>
                </div>
                <div id="popupBody">
                </div>
            </div>
        </div>
    `;
    document.body.innerHTML += popupHtml;
}

async function openPopup(conf = POPUP_CONF_DEFAULT, templateId) {
    closePopup();
    popupConfActive = conf;
    applyBackgroundCover();
    await displayPopup();
    displayPopupContent();
    displayPopupBody(templateId);
}

async function displayPopup() {
    const popup = document.querySelector('#popup');
    popup.style.top = (window.pageYOffset + 50) + "px";
    popup.style.display = 'block';
    await sleep(50);
    popup.classList.add(popupConfActive.dimensionClass);
    await sleep(300);
}

function displayPopupContent() {
    const popupContent = document.querySelector('#popupContent');
    const popupTopBar = document.querySelector('#popupTopBar');
    popupContent.style.display = 'block';
    popupTopBar.style.display = popupConfActive.displayCloseButton ? 'flex' : 'none';
}

function displayPopupBody(templateId) {
    const popupBody = document.querySelector('#popupBody');
    popupBody.innerHTML = '';
    if(templateId) {
        const template = document.querySelector(`#${templateId}`);
        const templateContent = template.content.querySelector('*');
        const templateHtml = document.importNode(templateContent, true);
        popupBody.appendChild(templateHtml);
    }
}

async function closePopup() {
    const popup = document.querySelector('#popup');
    const popupContent = document.querySelector('#popupContent');
    const popupTopBar = document.querySelector('#popupTopBar');
    popup.classList.remove(popupConfActive && popupConfActive.dimensionClass);
    popup.style.display = 'none';
    popupContent.style.display = 'none';
    popupTopBar.style.display = 'none';
    closeBackgroundCover();
}

function applyBackgroundCover() {
    const cover = document.querySelector('#backgroundCover');
    cover.style.display = 'block';
    cover.style.background = popupConfActive.coverBackground;
    cover.style.opacity = popupConfActive.coverOpacity;
    if (popupConfActive.coverCloseOnClick) {
        cover.addEventListener('click', closePopup);
    }
}

function closeBackgroundCover() {
    const cover = document.querySelector('#backgroundCover');
    cover.style.display = "none";
    if (popupConfActive && popupConfActive.coverCloseOnClick) {
        cover.removeEventListener('click', closePopup);
    }
}

initPopup();

