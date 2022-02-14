const storage = window.localStorage;

const timeframes = ['dailies', 'weeklies'];
var currentProfile = 'default';
var currentLayout = 'default';
var profilePrefix = '';
var dragRow; //global for currently dragged row
var totalDailyProfit = 0; //global for total daily profit, maybe move this

var dailies = {
    "chaos-dungeon": {task: "Chaos Dungeon", url: "https://lostarkive.com/guides/endgame/chaos-dungeons/", short: true, desc: "Uses 50 Energy per run.</br>Gain 100 Energy per day.", roster: false},
    "guardian-raid": {task: "Guardian Raid", url: "https://papunika.com/guardian-subjugations/", short: true, desc: "Uses 1 Guardian Soul per harvest.</br>Gain 2 Guardian Souls per day.", roster: false},
    "una-daily" : {task: "Una Daily", url: "https://papunika.com/unas-tasks-overview/", short: true, desc: "3 Una tasks per day.</br>Can be expanded up to +3.", roster: false},
    "trade-skill" : {task: "Trade Skill", url: "https://papunika.com/life-skill/", short: true, desc: "Until energy is depleted.", roster: false},
    "guild-support" : {task: "Guild Support", url: "#", short: true, desc: "1 Donation per day.</br>1 Research Support per day.", roster: false},
    "adventure-island" : {task: "Adventure Island", url: "https://lostarkive.com/guides/beginner/sea-activities/", short: true, desc: "Sat-Sun at 14:00 & 21:00.</br>Mon-Fri at 21:00.", roster: true},
    "voyage-coop-mission" : {task: "Vooyage Co-Op Mission", url: "https://papunika.com/voyage-guide/", short: true, desc: "Appears multiple times per day.", roster: true},
    "rapport-actions" : {task: "Rapport Actions", url: "https://papunika.com/affinity/", short: true, desc: "5 Songs per day (+1 with Blessing).</br>5 Emotes per day (+1 with Blessing).", roster: true},
    "world-boss" : {task: "World Boss", url: "#", short: true, desc: "Once per day (only on specific days).", roster: true},
    "chaos-gate" : {task: "Chaos Gate", url: "#", short: true, desc: "At specific times.", roster: true},
};

var weeklies = {
    "guardian-challenge-mode": {task: "Guardian Challenge Mode", url: "https://papunika.com/guardian-subjugations/", desc: "1 per week per Boss (3 in total).", roster: false},
    "abyss-dungeon" : {task: "Abyss Dungeon", url: "https://papunika.com/abyss-dungeons/", short: true, desc: "3 per week per Abyss Dungeon.</br>You can only complete one difficulty per week.", roster: false},
    "abyss-raid" : {task: "Abyss Raid", url: "https://papunika.com/abyss-raids/", short: true, desc: "1 per week per Abyss Raid.", roster: false},
    "legion-raid" : {task: "Legion Raid", url: "https://papunika.com/legion-raids/", short: true, desc: "1 per week (shared between difficutlies).", roster: false},
    "una-weekly" : {task: "Una Weekly", url: "https://papunika.com/unas-tasks-overview/", short: true, desc: "3 Una tasks per week.</br>Can be expanded up to +1.", roster: false},
    "challenge-abyss-dungeon" : {task: "Challenge Abyss Dungeon", url: "https://papunika.com/abyss-dungeons/", short: true, desc: "1 per week per Challenge Abyss Dungeon.", roster: true},
    "gvg-guild-boss" : {task: "GVG / Guild Boss", url: "#", short: true, desc: "Once per week.", roster: true},
    "merchant-ship-exchange" : {task: "Merchant Ship Exchange", url: "#", short: true, desc: "Supply replenishes on weekly reset.", roster: true},
    "silmael-bloodstone-exchange" : {task: "Silmael Bloodstone Exchange", url: "#", short: true, desc: "Supply replenishes on weekly reset.", roster: true},
    "pvp-token-exchange" : {task: "PVP Token Exchange", url: "#", short: true, desc: "Supply replenishes on weekly reset.", roster: true},
    "ghost-ship" : {task: "Ghost Ship", url: "https://lostarkive.com/guides/beginner/sea-activities/", short: true, desc: "At specific times.", roster: true},
    "pvp-island" : {task: "PVP Island", url: "#", short: true, desc: "Determined by the occupying guild.", roster: true},
};

/**
 * Populate the HTML with data for a timeFrame and attach listeners
 * @param {String} timeFrame
 * @returns
 */
const populateTable = function(timeFrame) {
    let data = window[timeFrame];

    const sampleRow = document.querySelector('#sample_row');
    const table = document.getElementById(timeFrame + '_table');
    const tbody = table.querySelector('tbody');

    //Hidden table
    let hideTable = storage.getItem(profilePrefix + timeFrame + '-hide') ?? 'false';
    if (hideTable == 'hide') {
        document.querySelector('div.' + timeFrame + '_table').dataset.hide = 'hide';
    }

    //User defined sorting
    let customOrder = storage.getItem(profilePrefix + timeFrame + '-order') ?? 'false';
    if (customOrder !== 'false' && !['asc', 'desc', 'alpha', 'default'].includes(customOrder)) {
        let sortArray = customOrder.split(',');

        data = Object.keys(data).sort(function(a, b) {
            return sortArray.indexOf(a) - sortArray.indexOf(b);
        }).reduce(
            (obj, key) => {
                obj[key] = data[key];
                return obj;
            },
            {}
        );
    }

    for (let taskSlug in data) {
        let rowClone = sampleRow.content.cloneNode(true);
        let newRow = rowClone.querySelector('tr');
        let newRowAnchor = rowClone.querySelector('td.activity_name a');
        let newRowColor = rowClone.querySelector('td.activity_color .activity_desc');
        let newRowRoster = rowClone.querySelector('span.activity_roster');

        let taskState = storage.getItem(profilePrefix + taskSlug) ?? 'false';

        newRow.dataset.task=taskSlug;

        if (!!data[taskSlug].url) {
            if(data[taskSlug].url !== "#"){
                newRowAnchor.href = data[taskSlug].url;
            } 
        }

        newRowAnchor.innerHTML = data[taskSlug].task;

        if (data[taskSlug].roster === true){
            newRowRoster.innerHTML = "Roster";
        }
        if (data[taskSlug].roster === false){
            newRowRoster.innerHTML = "Character";
        }

        if (!!data[taskSlug].desc) {
            newRowColor.innerHTML = data[taskSlug].desc;
        }

        tbody.appendChild(newRow);
        newRow.dataset.completed = taskState;
    }

    if (['asc', 'desc', 'alpha'].includes(customOrder)) {
        table.dataset.sort = customOrder;
        const tableRows = Array.from(tbody.querySelectorAll('tr'));
        tableRows.sort((a, b) => {
            if (customOrder == 'alpha') {
                return a.dataset.task.localeCompare(b.dataset.task)
            } else if (customOrder == 'asc') {
                return a.dataset.profit - b.dataset.profit;
            } else if (customOrder == 'desc') {
                return b.dataset.profit - a.dataset.profit;
            }
        });

        for (let sortedrow of tableRows) {
            tbody.appendChild(sortedrow);
        }
    }
};

/**
 * Attach event listeners to table cells
 */
const tableEventListeners = function() {
    let rowsColor = document.querySelectorAll('td.activity_color');
    let rowsHide = document.querySelectorAll('td.activity_name button.hide-button');

    for (let colorCell of rowsColor) {
        colorCell.addEventListener('click', function () {
            let thisTimeframe = this.closest('table').dataset.timeframe;
            let thisRow = this.closest('tr');
            let taskSlug = thisRow.dataset.task;
            let newState = (thisRow.dataset.completed === 'true') ? 'false' : 'true'
            thisRow.dataset.completed = newState;

            if (newState === 'true') {
                storage.setItem(profilePrefix + taskSlug, newState);
            } else {
                storage.removeItem(profilePrefix + taskSlug);
            }

            storage.setItem(profilePrefix + thisTimeframe + '-updated', new Date().getTime());
        });

        let descriptionAnchors = colorCell.querySelectorAll('a');
        for (let anchor of descriptionAnchors) {
            anchor.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }

    for (let rowHide of rowsHide) {
        rowHide.addEventListener('click', function() {
            let thisRow = this.closest('tr');
            let taskSlug = thisRow.dataset.task;
            thisRow.dataset.completed = 'hide';
            storage.setItem(profilePrefix + taskSlug, 'hide');
        });
    }
};

/**
 * Attach drag and drop functionality after elements added to DOM
 * @param {String} timeFrame
 */
const draggableTable = function(timeFrame) {

    const targetRows = document.querySelectorAll('#' + timeFrame + '_table tbody tr');

    for (let row of targetRows) {
        row.addEventListener('dragstart', function(e) {
            dragRow = e.target;
        });

        row.addEventListener('dragenter', function(e) {
            this.classList.add('dragover');
        });

        row.addEventListener('dragover', function(e) {
            e.preventDefault();

            //requery this in case rows reordered since load
            let rowArray = Array.from(document.querySelectorAll('#' + timeFrame + '_table tbody tr'));
            let dragOverRow = e.target.closest('tr');

            if (rowArray.indexOf(dragRow) < rowArray.indexOf(dragOverRow)) {
                dragOverRow.after(dragRow);
            } else {
                dragOverRow.before(dragRow);
            }
        });

        row.addEventListener('dragleave', function(e) {
            this.classList.remove('dragover');
        });

        row.addEventListener('dragend', function(e) {
            this.classList.remove('dragover');

            let clearRows = document.querySelectorAll('#' + timeFrame + '_table tbody tr');
            for (let clearRow of clearRows) {
                clearRow.classList.remove('dragover');
            }
        });

        row.addEventListener('drop', function(e) {
            e.stopPropagation();

            //save the order
            let csv = [];
            let rows = document.querySelectorAll('#' + timeFrame + '_table tbody tr');

            for (let row of rows) {
                csv.push(row.dataset.task);
            }

            storage.setItem(profilePrefix + timeFrame + '-order', csv.join(','));

            return false;
        });
    }
};

/**
 * Takes a timeframe name and clear the associated localstorage and toggle the html data off
 * @param {String} timeFrame
 * @param {Boolean} html change the data on the element or not
 */
const resetTable = function(timeFrame, html) {
    const tableRows = document.querySelectorAll('#' + timeFrame + '_table tbody tr');

    for (let rowTarget of tableRows) {
        let itemState = storage.getItem(profilePrefix + rowTarget.dataset.task) ?? 'false';
        if (itemState != 'hide') {
            if (html) {
                rowTarget.dataset.completed = false;
            }

            storage.removeItem(profilePrefix + rowTarget.dataset.task);
        }
    }

    storage.removeItem(profilePrefix + timeFrame + '-updated');
};

/**
 * Attach event listener to button for resetting table
 * @param {String} timeFrame
 */
const resettableSection = function(timeFrame) {
    let data = window[timeFrame];
    let resetButton = document.querySelector('#' + timeFrame + '_reset_button');
    resetButton.addEventListener('click', function () {
        resetTable(timeFrame, false);

        for (let taskSlug in data) {
            let itemState = storage.getItem(profilePrefix + taskSlug) ?? 'false';

            if (itemState == 'hide') {
                storage.removeItem(profilePrefix + taskSlug);
            }
        }

        storage.removeItem(profilePrefix + timeFrame + '-order');
        window.location.reload();
    });
};

/**
 * Attach event listener for hiding/unhiding table
 * @param {String} timeFrame
 */
const hidableSection = function(timeFrame) {
    let hideButton = document.querySelector('#' + timeFrame + '_hide_button');
    hideButton.addEventListener('click', function () {
        let hideTable = document.querySelector('div.' + timeFrame + '_table');
        hideTable.dataset.hide = 'hide';
        storage.setItem(profilePrefix + timeFrame + '-hide', 'hide');
    });

    let navLink = document.querySelector('#' + timeFrame + '_nav');
    navLink.addEventListener('click', function() {
        let hideTable = document.querySelector('div.' + timeFrame + '_table');
        hideTable.dataset.hide = '';
        storage.removeItem(profilePrefix + timeFrame + '-hide');
    });

    let unhideButton = document.querySelector('#' + timeFrame + '_unhide_button');
    unhideButton.addEventListener('click', function() {
        let hideTable = document.querySelector('div.' + timeFrame + '_table');
        hideTable.dataset.hide = '';
        storage.removeItem(profilePrefix + timeFrame + '-hide');
    });
};

/**
 * Check if last updated timestamp for a timeframe is less than
 * the last reset for that timeframe if so reset the category
 * @param {String} timeFrame
 * @returns
 */
const checkReset = function(timeFrame) {
    let tableUpdateTime = storage.getItem(profilePrefix + timeFrame + '-updated') ?? 'false';

    if (tableUpdateTime === 'false') {
        return false;
    }

    let updateTime = new Date(parseInt(tableUpdateTime));


    let nextdate = new Date();
    nextdate.setUTCHours(10);
    nextdate.setUTCMinutes(0);
    nextdate.setUTCSeconds(0);

    //check lastupdated < last weekly reset
    if (timeFrame == 'weeklies') {
        let resetday = 4;
        let weekmodifier = (7 - resetday + nextdate.getUTCDay()) % 7;
        nextdate.setUTCDate(nextdate.getUTCDate() - weekmodifier);
    }

    if (updateTime.getTime() < nextdate.getTime()) {
        resetTable(timeFrame, true);
    }
};

/**
 * Add a countdown timer until the next reset for a timeframe
 * @param {String} timeFrame
 */
const countDown = function(timeFrame) {
    let nextdate = new Date();

    if (timeFrame == 'weeklies') {
        let resetday = 4;
        nextdate.setUTCHours(10);
        nextdate.setUTCMinutes(0);
        nextdate.setUTCSeconds(0);
        let weekmodifier = (7 + resetday - nextdate.getUTCDay() ) % 7;
        nextdate.setUTCDate(nextdate.getUTCDate() + weekmodifier);
    } else {
        nextdate.setUTCHours(10);
        nextdate.setUTCMinutes(0);
        nextdate.setUTCSeconds(0);
        let weekmodifier = (2 - nextdate.getUTCDay() ) % 7;
        nextdate.setUTCDate(nextdate.getUTCDate() + weekmodifier);
    }

    let nowtime = new Date();
    let remainingtime = (nextdate.getTime() - nowtime.getTime()) / 1000;

    let timeparts = [
        Math.floor(remainingtime / 86400), //d
        Math.floor(remainingtime % 86400 / 3600), //h
        Math.floor(remainingtime % 3600 / 60), //m
        Math.floor(remainingtime % 60) //s
    ];

    document.getElementById('countdown-' + timeFrame).innerHTML = (timeparts[0] > 0 ? (timeparts[0] + 'd ') : '') + (timeparts[1] > 0 ? (timeparts[1] + 'h ') : '') + timeparts[2] + 'm ' + timeparts[3] + 's';
};

/**
 * Good enough for now profile system
 * @todo make it better
 */
const profiles = function() {
    let profilesStored= storage.getItem('profiles') ?? 'default';
    let profilesArray = profilesStored.split(',');

    currentProfile = storage.getItem('current-profile') ?? 'default';
    profilePrefix = currentProfile == 'default' ? '' : currentProfile + '-';

    if (profilesArray.length > 1) {
        let profileName = document.getElementById('profile-name');
        profileName.innerHTML = currentProfile;
        profileName.style.display = 'inline-block';
        profileName.style.visibility = 'visible';
    }

    let profilebutton = document.getElementById('profile-button');
    let profileControl = document.getElementById('profile-control');
    let profileForm = profileControl.querySelector('form');
    let profileName = document.getElementById('profileName');
    let profileList = document.getElementById('profile-list');

    //populate list of existing profiles
    for (let profile of profilesArray) {
        let deleteButton = profile !== 'default' ? '<span class="profile-delete btn btn-danger btn-sm active" data-profile="' + profile + '" title="Delete ' + profile + '">⊘</span>' : '';
        if (profile !== currentProfile) {
            profileList.innerHTML += '<li><a href="#" data-profile="' + profile + '">' + profile + '</a>' + deleteButton + '</li>';
        } else {
            profileList.innerHTML += '<li>' + profile + deleteButton + '</li>'
        }
    }

    //Event listener for profile links
    let profileLinks = profileList.querySelectorAll('li a');
    for (let profileLink of profileLinks) {
        profileLink.addEventListener('click', function(e) {
            e.preventDefault();

            let switchProfile = this.dataset.profile;
            storage.setItem('current-profile', switchProfile);
            window.location.reload();
        });
    }

    //Event listener for delete profile button
    let deleteButtons = profileList.querySelectorAll('.profile-delete');
    for (let deleteButton of deleteButtons) {
        deleteButton.addEventListener('click', function(e) {
            e.preventDefault();
            profilesArray = profilesArray.filter(e => e != this.dataset.profile);
            storage.setItem('profiles', profilesArray.join(','));

            if (this.dataset.profile == currentProfile) {
                storage.setItem('current-profile', 'default');
            }

            let prefix = this.dataset.profile == 'default' ? '' : (this.dataset.profile + '-');
            for (const timeFrame of timeframes) {
                let data = window[timeFrame];
                for (let task in data) {
                    storage.removeItem(prefix + task);
                }
                storage.removeItem(prefix + timeFrame + '-order');
                storage.removeItem(prefix + timeFrame + '-updated');
            }

            window.location.reload();
        });
    }

    //alpha-numeric profile names only
    profileName.addEventListener('keypress', function(e) {
        if (!/^[A-Za-z0-9]+$/.test(e.key)) {
            e.preventDefault();
            return false;
        }
    });

    //Event listener for the main button hiding/showing control
    profilebutton.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        let display=profileControl.dataset.display;
        if (display == 'none') {
            profileControl.style.display = 'block';
            profileControl.style.visibility = 'visible';
            profileControl.dataset.display = 'block';
        } else {
            profileControl.style.display = 'none';
            profileControl.style.visibility = 'hidden';
            profileControl.dataset.display = 'none';
        }
    });

    // Save data on submit
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let profileNameField = this.querySelector('input#profileName');
        let profileErrorMsg = profileNameField.parentNode.querySelector('.invalid-feedback');

        if (!/^[A-Za-z0-9]+$/.test(profileNameField.value)) {
            profileName.classList.add('is-invalid');
            profileErrorMsg.innerHTML = 'Alpha numeric and no spaces only';
        } else if (profilesArray.includes(profileNameField.value)) {
            profileName.classList.add('is-invalid');
            profileErrorMsg.innerHTML = 'Profile already exists';
        } else {
            profilesArray.push(profileNameField.value);
            storage.setItem('profiles', profilesArray.join(','));
            storage.setItem('current-profile', profileNameField.value);
            window.location.reload();
        }
    });

    profileControl.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    document.addEventListener('click', function(e) {
        profileControl.style.display = 'none';
        profileControl.style.visibility = 'hidden';
        profileControl.dataset.display = 'none';
    });

    document.addEventListener('scroll', function(e) {
        profileControl.style.display = 'none';
        profileControl.style.visibility = 'hidden';
        profileControl.dataset.display = 'none';
    });
};

const layouts = function() {
    const layoutButton = document.getElementById('layout-button');
    const layoutGlyph = layoutButton.querySelector('.glyph');
    let currentLayout = storage.getItem('current-layout') ?? 'default';
    if (currentLayout !== 'default') {
        document.body.classList.add('compact');
        layoutButton.innerHTML = '⊞<span class="expanding_text">&nbsp;Full Mode</span>';
    }

    layoutButton.addEventListener('click', function(e) {
        e.preventDefault();

        let setLayout = document.body.classList.contains('compact') ? 'compact' : 'default';

        if (setLayout == 'default') {
            storage.setItem('current-layout', 'compact');
            document.body.classList.add('compact');
            layoutButton.innerHTML = '⊞<span class="expanding_text">&nbsp;Full Mode</span>';
        } else {
            storage.removeItem('current-layout');
            document.body.classList.remove('compact');
            layoutButton.innerHTML = '⊟<span class="expanding_text">&nbsp;Compact Mode</span>';
        }
    });
};

/**
 * Make bootstrap 5 dropdown menus collapse after link is clicked
 * old method of adding `data-toggle="collapse" data-target=".navbar-collapse.show"` to the <li>s was preventing navigation by the same element
 */
const dropdownMenuHelper = function() {
    const navLinks = document.querySelectorAll('.nav-item:not(.dropdown), .dropdown-item');
    const menuToggle = document.getElementById('navbarSupportedContent');
    const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle: false});

    navLinks.forEach( function(l) {
        l.addEventListener('click', function() {
            if (menuToggle.classList.contains('show')) {
                bsCollapse.toggle();
            }
        });
    });
};

window.onload = function() {
    profiles();
    layouts();

    for (const timeFrame of timeframes) {
        populateTable(timeFrame);
        draggableTable(timeFrame);
        checkReset(timeFrame);
        resettableSection(timeFrame);
        hidableSection(timeFrame);
        countDown(timeFrame);
    }

    dropdownMenuHelper();
    tableEventListeners();

    setInterval(function() {
        for (const timeFrame of timeframes) {
            checkReset(timeFrame);
            countDown(timeFrame);
        }
    }, 1000);
};
