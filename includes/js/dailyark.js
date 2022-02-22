const storage = window.localStorage;

const timeframesRoster = ['dailies', 'weeklies'];
const timeframesCharacter = ['dailychar', 'weeklychar'];
var currentProfile = 'default';
var currentLayout = 'default';
var characters = '';
var dragRow; //global for currently dragged row

var dailies = {
    "rapport-actions-songs": {
        task: "Rapport Songs",
        url: "https://papunika.com/affinity/",
        short: true,
        desc: "5 Songs per day (+1 with Blessing)."
    },
    "rapport-actions-emotes": {
        task: "Rapport Emotes",
        url: "https://papunika.com/affinity/",
        short: true,
        desc: "5 Emotes per day (+1 with Blessing)."
    },
    "trade-skill": {
        task: "Trade Skill",
        url: "https://papunika.com/life-skill/",
        short: true,
        desc: "Until energy is depleted."
    },
    "adventure-island": {
        task: "Adventure Island",
        url: "https://lostarkive.com/guides/beginner/sea-activities/",
        short: true,
        desc: "Sat-Sun at 14:00 & 21:00.</br>Mon-Fri at 21:00."
    },
    "voyage-coop-mission": {
        task: "Sailing Co-Op Mission",
        url: "https://papunika.com/voyage-guide/",
        short: true,
        desc: "Appears multiple times per day."
    },
    "world-boss": {
        task: "World Boss",
        url: "#",
        short: true,
        desc: "Once per day (only on specific days)."
    },
    "chaos-gate": {
        task: "Chaos Gate",
        url: "#",
        short: true,
        desc: "At specific times."
    },
};

var dailychar = {
    "chaos-dungeon": {
        task: "Chaos Dungeon 1",
        url: "https://lostarkive.com/guides/endgame/chaos-dungeons/",
        short: true,
        desc: "Uses 50 Energy per run.</br>Gain 100 Energy per day."
    },
    "chaos-dungeon-2": {
        task: "Chaos Dungeon 2",
        url: "https://lostarkive.com/guides/endgame/chaos-dungeons/",
        short: true,
        desc: "Uses 50 Energy per run.</br>Gain 100 Energy per day."
    },
    "guardian-raid": {
        task: "Guardian Raid 1",
        url: "https://papunika.com/guardian-subjugations/",
        short: true,
        desc: "Uses 1 Guardian Soul per harvest.</br>Gain 2 Guardian Souls per day."
    },
    "guardian-raid-2": {
        task: "Guardian Raid 2",
        url: "https://papunika.com/guardian-subjugations/",
        short: true,
        desc: "Uses 1 Guardian Soul per harvest.</br>Gain 2 Guardian Souls per day."
    },
    "una-daily": {
        task: "Una Daily 1",
        url: "https://papunika.com/unas-tasks-overview/",
        short: true,
        desc: "3 Una tasks per day.</br>Can be expanded up to +3."
    },
    "una-daily-2": {
        task: "Una Daily 2",
        url: "https://papunika.com/unas-tasks-overview/",
        short: true,
        desc: "3 Una tasks per day.</br>Can be expanded up to +3."
    },
    "una-daily-3": {
        task: "Una Daily 3",
        url: "https://papunika.com/unas-tasks-overview/",
        short: true,
        desc: "3 Una tasks per day.</br>Can be expanded up to +3."
    },
    "guild-support": {
        task: "Guild Support",
        url: "#",
        short: true,
        desc: "1 Donation per day.</br>1 Research Support per day."
    },
}

var weeklychar = {
    "guardian-challenge-mode": {
        task: "Guardian Challenge Mode 1",
        url: "https://papunika.com/guardian-subjugations/",
        desc: "1 per week per Boss (3 in total)."
    },
    "guardian-challenge-mode-2": {
        task: "Guardian Challenge Mode 2",
        url: "https://papunika.com/guardian-subjugations/",
        desc: "1 per week per Boss (3 in total)."
    },
    "guardian-challenge-mode-3": {
        task: "Guardian Challenge Mode 3",
        url: "https://papunika.com/guardian-subjugations/",
        desc: "1 per week per Boss (3 in total)."
    },
    "abyss-dungeon": {
        task: "Abyss Dungeon",
        url: "https://papunika.com/abyss-dungeons/",
        short: true,
        desc: "Once per week per Abyss Dungeon.</br>You can only complete one difficulty per week."
    },
    "una-weekly": {
        task: "Una Weekly 1",
        url: "https://papunika.com/unas-tasks-overview/",
        short: true,
        desc: "3 Una tasks per week.</br>Can be expanded up to +1."
    },
    "una-weekly-2": {
        task: "Una Weekly 2",
        url: "https://papunika.com/unas-tasks-overview/",
        short: true,
        desc: "3 Una tasks per week.</br>Can be expanded up to +1."
    },
    "una-weekly-3": {
        task: "Una Weekly 3",
        url: "https://papunika.com/unas-tasks-overview/",
        short: true,
        desc: "3 Una tasks per week.</br>Can be expanded up to +1."
    },
    "abyss-raid": {
        task: "Abyss Raid",
        url: "https://papunika.com/abyss-raids/",
        short: true,
        desc: "1 per week per Abyss Raid."
    },
    "legion-raid": {
        task: "Legion Raid",
        url: "https://papunika.com/legion-raids/",
        short: true,
        desc: "1 per week (shared between difficutlies)."
    },
    "merchant-ship-exchange": {
        task: "Merchant Ship Exchange",
        url: "#",
        short: true,
        desc: "Supply replenishes on weekly reset."
    },
    "silmael-bloodstone-exchange": {
        task: "Silmael Bloodstone Exchange",
        url: "#",
        short: true,
        desc: "Supply replenishes on weekly reset."
    },
    "chaos-dungeon-shard-exchange": {
        task: "Chaos Dungeon Shard Exchange",
        url: "#",
        short: true,
        desc: "Supply replenishes on weekly reset."
    },
}

var weeklies = {
    "challenge-abyss-dungeon": {
        task: "Challenge Abyss Dungeon",
        url: "https://papunika.com/abyss-dungeons/",
        short: true,
        desc: "1 per week per Challenge Abyss Dungeon."
    },
    "gvg-guild-boss": {
        task: "GVG / Guild Boss",
        url: "#",
        short: true,
        desc: "Once per week."
    },
    "pvp-token-exchange": {
        task: "PVP Token Exchange",
        url: "#",
        short: true,
        desc: "Supply replenishes on weekly reset."
    },
    "ghost-ship": {
        task: "Ghost Ship",
        url: "https://lostarkive.com/guides/beginner/sea-activities/",
        short: true,
        desc: "At specific times."
    },
    "pvp-island": {
        task: "PVP Island",
        url: "#",
        short: true,
        desc: "Determined by the occupying guild."
    },
};

/**
 * Populate the HTML with data for a timeFrame and attach listeners
 * @param {String} timeFrame
 * @returns
 */
const populateTable = function (timeFrame, char) {
    profilePrefix = char;
    let data = window[timeFrame];
    let table;
    let hideTable;
    let customOrder;

    const sampleRow = document.querySelector('#sample_row');
    if (profilePrefix != null) {
        table = document.getElementById(profilePrefix + '_' + timeFrame + '_table');
    } else {
        table = document.getElementById(timeFrame + '_table');

    }
    const tbody = table.querySelector('tbody');

    //Hidden table
    if (profilePrefix != null) {
        hideTable = storage.getItem(profilePrefix + '-' + timeFrame + '-hide') ?? 'false';
    } else {
        hideTable = storage.getItem(timeFrame + '-hide') ?? 'false';
    }

    if (hideTable == 'hide') {
        if (profilePrefix != null) {
            document.querySelector('div.' + profilePrefix + '_' + timeFrame + '_table').dataset.hide = 'hide';
        } else {
            document.querySelector('div.' + timeFrame + '_table').dataset.hide = 'hide';
        }

    }

    //User defined sorting
    if (profilePrefix != null) {
        customOrder = storage.getItem(profilePrefix + '-' + timeFrame + '-order') ?? 'false';
    } else {
        customOrder = storage.getItem(timeFrame + '-order') ?? 'false';
    }
    if (customOrder !== 'false' && !['asc', 'desc', 'alpha', 'default'].includes(customOrder)) {
        let sortArray = customOrder.split(',');

        data = Object.keys(data).sort(function (a, b) {
            return sortArray.indexOf(a) - sortArray.indexOf(b);
        }).reduce(
            (obj, key) => {
                obj[key] = data[key];
                return obj;
            }, {}
        );
    }

    for (let taskSlug in data) {
        let rowClone = sampleRow.content.cloneNode(true);
        let newRow = rowClone.querySelector('tr');
        let newRowAnchor = rowClone.querySelector('td.activity_name a');
        let newRowColor = rowClone.querySelector('td.activity_color .activity_desc');
        let taskState;

        if (profilePrefix != null) {
            taskState = storage.getItem(profilePrefix + '-' + taskSlug) ?? 'false';
        } else {
            taskState = storage.getItem(taskSlug) ?? 'false';
        }

        newRow.dataset.task = taskSlug;

        if (!!data[taskSlug].url) {
            if (data[taskSlug].url !== "#") {
                newRowAnchor.href = data[taskSlug].url;
            }
        }

        newRowAnchor.innerHTML = data[taskSlug].task;

        if (!!data[taskSlug].desc) {
            newRowColor.innerHTML = data[taskSlug].desc;
        }

        tbody.appendChild(newRow);
        newRow.dataset.completed = taskState;
    }

    if (['asc', 'desc', 'alpha'].includes(customOrder)) {
        table.dataset.sort = customOrder;
        let tableRows = Array.from(tbody.querySelectorAll('tr'));
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

    let tableRows = Array.from(tbody.querySelectorAll('tr'));
    for (let row of tableRows) {
        if (row.dataset.completed == 'hide') {
            tbody.appendChild(row);
        }
    }
};

/**
 * Attach event listeners to table cells
 */
const tableEventListeners = function () {
    let rowsColor = document.querySelectorAll('td.activity_color');
    let rowsHide = document.querySelectorAll('td.activity_name button.hide-button');

    for (let colorCell of rowsColor) {
        colorCell.addEventListener('click', function () {
            let thisTimeframe = this.closest('table').dataset.timeframe;
            let thisCharacter = this.closest('table').dataset.character;
            let thisRow = this.closest('tr');
            let taskSlug = thisRow.dataset.task;
            let newState = (thisRow.dataset.completed === 'true') ? 'false' : 'true'
            thisRow.dataset.completed = newState;
            if (newState === 'true') {
                if (thisCharacter != null) {
                    storage.setItem(thisCharacter + '-' + taskSlug, newState);
                } else {
                    storage.setItem(taskSlug, newState);
                }

            } else {
                if (thisCharacter != null) {
                    storage.removeItem(thisCharacter + '-' + taskSlug);
                } else {
                    storage.removeItem(taskSlug);
                }
            }
            if (thisCharacter != null) {
                storage.setItem(thisCharacter + '-' + thisTimeframe + '-updated', new Date().getTime());
            } else {
                storage.setItem(thisTimeframe + '-updated', new Date().getTime());
            }
        });

        let descriptionAnchors = colorCell.querySelectorAll('a');
        for (let anchor of descriptionAnchors) {
            anchor.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }
    }

    for (let rowHide of rowsHide) {
        rowHide.addEventListener('click', function () {
            let thisTbody = this.closest('tbody');
            let thisRow = this.closest('tr');
            let taskSlug = thisRow.dataset.task;
            let thisCharacter = this.closest('table').dataset.character;
            thisRow.dataset.completed = 'hide';
            if (thisCharacter != null) {
                storage.setItem(thisCharacter + '-' + taskSlug, 'hide');
            } else {
                storage.setItem(taskSlug, 'hide');
            }
            thisTbody.appendChild(thisRow);
        });
    }
};

/**
 * Attach drag and drop functionality after elements added to DOM
 * @param {String} timeFrame
 */
const draggableTable = function (timeFrame, char) {
    profilePrefix = char;
    let targetRows;
    if (profilePrefix != null) {
        targetRows = document.querySelectorAll('#' + profilePrefix + '_' + timeFrame + '_table tbody tr');
    } else {
        targetRows = document.querySelectorAll('#' + timeFrame + '_table tbody tr');
    }

    for (let row of targetRows) {
        row.addEventListener('dragstart', function (e) {
            dragRow = e.target;
        });

        row.addEventListener('dragenter', function (e) {
            this.classList.add('dragover');
        });

        row.addEventListener('dragover', function (e) {
            e.preventDefault();
            let rowArray
            let thisCharacter = this.closest('table').dataset.character;
            //requery this in case rows reordered since load
            if (thisCharacter != null) {
                rowArray = Array.from(document.querySelectorAll('#' + thisCharacter + '_' + timeFrame + '_table tbody tr'));
            } else {
                rowArray = Array.from(document.querySelectorAll('#' + timeFrame + '_table tbody tr'));
            }


            let dragOverRow = e.target.closest('tr');

            if (rowArray.indexOf(dragRow) < rowArray.indexOf(dragOverRow)) {
                dragOverRow.after(dragRow);
            } else {
                dragOverRow.before(dragRow);
            }
        });

        row.addEventListener('dragleave', function (e) {
            this.classList.remove('dragover');
        });

        row.addEventListener('dragend', function (e) {
            this.classList.remove('dragover');
            let clearRows;
            let thisCharacter = this.closest('table').dataset.character;
            if (thisCharacter != null) {
                clearRows = document.querySelectorAll('#' + thisCharacter + '_' + timeFrame + '_table tbody tr');
            } else {
                clearRows = document.querySelectorAll('#' + timeFrame + '_table tbody tr');
            }
            for (let clearRow of clearRows) {
                clearRow.classList.remove('dragover');
            }
        });

        row.addEventListener('drop', function (e) {
            e.stopPropagation();
            let thisCharacter = this.closest('table').dataset.character;

            //save the order
            let csv = [];
            let rows;
            if (thisCharacter != null) {
                rows = document.querySelectorAll('#' + thisCharacter + '_' + timeFrame + '_table tbody tr');
            } else {
                rows = document.querySelectorAll('#' + timeFrame + '_table tbody tr');
            }
            for (let row of rows) {
                csv.push(row.dataset.task);
            }

            if (thisCharacter != null) {
                storage.setItem(thisCharacter + '-' + timeFrame + '-order', csv.join(','));
            } else {
                storage.setItem(timeFrame + '-order', csv.join(','));
            }

            return false;
        });
    }
};

/**
 * Takes a timeframe name and clear the associated localstorage and toggle the html data off
 * @param {String} timeFrame
 * @param {Boolean} html change the data on the element or not
 */
const resetTable = function (timeFrame, html, char) {
    profilePrefix = char;
    let tableRows;
    if (profilePrefix != null) {
        tableRows = document.querySelectorAll('#' + profilePrefix + '_' + timeFrame + '_table tbody tr');
    } else {
        tableRows = document.querySelectorAll('#' + timeFrame + '_table tbody tr');
    }

    for (let rowTarget of tableRows) {
        let itemState;
        if (profilePrefix != null) {
            itemState = storage.getItem(profilePrefix + '-' + rowTarget.dataset.task) ?? 'false';
        } else {
            itemState = storage.getItem(rowTarget.dataset.task) ?? 'false';
        }

        if (itemState != 'hide') {
            if (html) {
                rowTarget.dataset.completed = false;
            }
            if (profilePrefix != null) {
                storage.removeItem(profilePrefix + '-' + rowTarget.dataset.task);
            } else {
                storage.removeItem(rowTarget.dataset.task);
            }
        }
    }

    if (profilePrefix != null) {
        storage.removeItem(profilePrefix + '-' + timeFrame + '-updated');
    } else {
        storage.removeItem(timeFrame + '-updated');
    }

};

/**
 * Attach event listener to button for resetting table
 * @param {String} timeFrame
 */
const resettableSection = function (timeFrame, char) {
    profilePrefix = char;
    let data = window[timeFrame];
    let resetButton;

    if (profilePrefix != null) {
        resetButton = document.querySelector('#' + profilePrefix + '_' + timeFrame + '_reset_button');
    } else {
        resetButton = document.querySelector('#' + timeFrame + '_reset_button');
    }

    resetButton.addEventListener('click', function () {
        let thisCharacter = this.closest('table').dataset.character;
        resetTable(timeFrame, false, thisCharacter);

        for (let taskSlug in data) {
            let itemState;
            if (profilePrefix != null) {
                itemState = storage.getItem(profilePrefix + '-' + taskSlug) ?? 'false';
            } else {
                itemState = storage.getItem(taskSlug) ?? 'false';
            }

            if (itemState == 'hide') {
                if (profilePrefix != null) {
                    storage.removeItem(profilePrefix + '-' + taskSlug);
                } else {
                    storage.removeItem(taskSlug);
                }
            }
        }
        if (profilePrefix != null) {
            storage.removeItem(profilePrefix + '-' + timeFrame + '-order');
            storage.removeItem('pos_'+profilePrefix+'_'+timeFrame+'_table');
        } else {
            storage.removeItem(timeFrame + '-order');
            storage.removeItem('pos_'+timeFrame);
        }
        window.location.reload();
    });
};

/**
 * Attach event listener for hiding/unhiding table
 * @param {String} timeFrame
 */
const hidableSection = function (timeFrame, char) {
    profilePrefix = char;
    let hideButton;
    let unhideButton;
    let hideTable;

    if (profilePrefix != null) {
        hideButton = document.querySelector('#' + profilePrefix + '_' + timeFrame + '_hide_button');
        unhideButton = document.querySelector('#' + profilePrefix + '_' + timeFrame + '_unhide_button');
    } else {
        hideButton = document.querySelector('#' + timeFrame + '_hide_button');
        unhideButton = document.querySelector('#' + timeFrame + '_unhide_button');
    }

    hideButton.addEventListener('click', function () {
        let thisCharacter = this.closest('table').dataset.character;
        if (thisCharacter != null) {
            hideTable = document.querySelector('div.' + thisCharacter + '_' + timeFrame + '_table');
            hideTable.dataset.hide = 'hide';
            storage.setItem(thisCharacter + '-' + timeFrame + '-hide', 'hide');
        } else {
            hideTable = document.querySelector('div.' + timeFrame + '_table');
            hideTable.dataset.hide = 'hide';
            storage.setItem(timeFrame + '-hide', 'hide');
        }
    });

    unhideButton.addEventListener('click', function () {
        let thisCharacter = this.closest('table').dataset.character;
        if (thisCharacter != null) {
            hideTable = document.querySelector('div.' + thisCharacter + '_' + timeFrame + '_table');
            hideTable.dataset.hide = '';
            storage.removeItem(thisCharacter + '-' + timeFrame + '-hide');
        } else {
            hideTable = document.querySelector('div.' + timeFrame + '_table');
            hideTable.dataset.hide = '';
            storage.removeItem(timeFrame + '-hide');
        }

    });
};

/**
 * Check if last updated timestamp for a timeframe is less than
 * the last reset for that timeframe if so reset the category
 * @param {String} timeFrame
 * @returns
 */
const checkReset = function (timeFrame, char) {
    profilePrefix = char;
    const resetHour = 10;
    const resetday = 4;
    let tableUpdateTime;

    if (profilePrefix != null) {
        tableUpdateTime = storage.getItem(profilePrefix + '-' + timeFrame + '-updated') ?? 'false';
    } else {
        tableUpdateTime = storage.getItem(timeFrame + '-updated') ?? 'false';
    }

    if (tableUpdateTime === 'false') {
        return false;
    }

    let updateTime = new Date(parseInt(tableUpdateTime));

    let nextdate = new Date();
    nextdate.setUTCHours(resetHour);
    nextdate.setUTCMinutes(0);
    nextdate.setUTCSeconds(0);

    //check lastupdated < last weekly reset
    if (timeFrame == 'weeklies' || timeFrame == 'weeklychar') {
        let weekmodifier = (7 - resetday + nextdate.getUTCDay()) % 7;
        nextdate.setUTCDate(nextdate.getUTCDate() - weekmodifier);
    }

    // Checking for the update for the daily timeframe is a little more complex because 
    // originally we pulled this from RS, this expects that if the new day has happened 
    // its reset time, but we need to allow some freedom between 0 - 10am UTC (resetTime).
    const isAfterReset = new Date().getUTCHours() >= resetHour;
    const isAfterWeeklyReset = new Date().getUTCDay() >= resetday;
    if ((updateTime.getUTCHours() < resetHour || nextdate.getUTCHours() == resetHour) && updateTime.getTime() < nextdate.getTime() && isAfterReset) {
        if ((timeFrame == 'weeklies' || timeFrame == 'weeklychar') && (updateTime.getUTCDay() < resetday || nextdate.getUTCDay() == resetday) && isAfterWeeklyReset) {
            resetTable(timeFrame, true, profilePrefix);    
        } else if (timeFrame == 'dailies' || timeFrame == 'dailychar'){
            resetTable(timeFrame, true, profilePrefix);
        } else {
            return;
        }
    }
};

/**
 * Add a countdown timer until the next reset for a timeframe
 * @param {String} timeFrame
 */
const countDown = function (timeFrame) {
    const resetHour = 10; // 10am
    const resetday = 4; // Thursday
    const isAfterDailyReset = new Date().getUTCHours() >= resetHour;
    const isAfterWeeklyReset = new Date().getUTCDay() == resetday;

    let nextdate = new Date();

    if (timeFrame == 'weeklies') {
        nextdate.setUTCHours(resetHour);
        nextdate.setUTCMinutes(0);
        nextdate.setUTCSeconds(0);
        let weekmodifier = (7 + resetday - nextdate.getUTCDay()) % 7;
        nextdate.setUTCDate(nextdate.getUTCDate() + weekmodifier);
        if(isAfterWeeklyReset && isAfterDailyReset){
            nextdate.setUTCDate(nextdate.getUTCDate() + 7);
        }
    } else {
        nextdate.setUTCHours(resetHour);
        nextdate.setUTCMinutes(0);
        nextdate.setUTCSeconds(0);
        if (isAfterDailyReset) {
            nextdate.setUTCDate(nextdate.getUTCDate() + 1);
        }
    }

    let nowtime = new Date();
    let remainingtime = (nextdate.getTime() - nowtime.getTime()) / 1000;

    let timeparts = [
        Math.floor(remainingtime / 86400), //d
        Math.floor(remainingtime % 86400 / 3600), //h
        Math.floor(remainingtime % 3600 / 60), //m
        Math.floor(remainingtime % 60) //s
    ];

    if(timeFrame == 'weeklies'){
        document.getElementById('countdown-' + timeFrame).innerHTML = (timeparts[0] > 0 ? (timeparts[0] + 'd ') : '0d ') + (timeparts[1] > 0 ? (timeparts[1] + 'h ') : '') + timeparts[2] + 'm ' + timeparts[3] + 's';
    } else {
        document.getElementById('countdown-' + timeFrame).innerHTML = (timeparts[0] > 0 ? (timeparts[0] + 'd ') : '') + (timeparts[1] > 0 ? (timeparts[1] + 'h ') : '') + timeparts[2] + 'm ' + timeparts[3] + 's';
    }    
};

const populateNavigation = function(index, character){
    let navigation = document.getElementById('character_dropdown');
    charNavigation = '';
    if(index > 0){
        charNavigation +='<div class="dropdown-divider"></div>';
    }
    charNavigation +='<h6 class="dropdown-header nav-char">'+character+'</h6>';
    for(let timeframe in timeframesRoster){
        charNavigation += '<a href="#'+character+'_'+timeframesCharacter[timeframe]+'" class="dropdown-item sub-color" id="'+character+'_'+timeframesCharacter[timeframe]+'_nav" style="text-transform: capitalize;">'+timeframesRoster[timeframe]+'</a>';
    }
    navigation.innerHTML += charNavigation;
}

const charactersFunction = function () {
    let charactersStored = storage.getItem('characters');
    let characterControl = document.getElementById('character-control');
    let characterForm = characterControl.querySelector('form');
    let charactersArray = [];

    if (charactersStored !== null) {
        charactersArray = charactersStored.split(',');

        let characterBody = document.getElementById('characters_body')

        //populate list of characters
        for (let character of charactersArray) {
            characterBody.innerHTML +=
                '<div class="table_container_characters">'+
                '<div id="' + character + '_dailychar" class="table_container ' + character + '_dailychar_table">' +
                '<table id="' + character + '_dailychar_table" class="activity_table table table-dark table-striped table-hover draggable" data-timeframe="dailychar" data-character="'+character+'">' +
                '<thead>' +
                '<tr>' +
                '<th>' + character + ' Daily</th>' +
                '<td>' +
                '<span class="text-nowrap">' +
                '<button class="drag-handle expanding_button btn btn-secondary btn-sm active" title="Click, hold and drag to move section">✥<span class="expanding_text"> Move</span></button> ' +
                '<button id="' + character + '_dailychar_hide_button" class="hide_button expanding_button btn btn-secondary btn-sm active" title="Hide section">▲<span class="expanding_text"> Hide</span></button> ' +
                '<button id="' + character + '_dailychar_unhide_button" class="unhide_button expanding_button btn btn-secondary btn-sm active" title="Unhide Section">▼<span class="expanding_text"> Unhide</span></button> ' +
                '<button id="' + character + '_dailychar_reset_button" class="reset_button expanding_button btn btn-secondary btn-sm active" title="Completely reset checked items, hiding and order to default">↺<span class="expanding_text"> Reset</span></button> ' +
                '<button id="character-delete" class="btn btn-danger btn-sm active expanding_button" data-character="' + character + '" title="Delete ' + character + '">⊘<span class="expanding_text"> Delete ' + character + '?</span></button>' +
                '</td>' +
                '</tr>' +
                '</thead>' +
                '<tbody></tbody>' +
                '</table>' +
                '</div>'+
                '<div id="' + character + '_weeklychar" class="table_container ' + character + '_weeklychar_table">' +
                '<table id="' + character + '_weeklychar_table" class="activity_table table table-dark table-striped table-hover draggable" data-timeframe="weeklychar" data-character="'+character+'">' +
                '<thead>' +
                '<tr>' +
                '<th>' + character + ' Weekly</th>' +
                '<td>' +
                '<span class="text-nowrap">' +
                '<button class="drag-handle expanding_button btn btn-secondary btn-sm active" title="Click, hold and drag to move section">✥<span class="expanding_text"> Move</span></button> ' +
                '<button id="' + character + '_weeklychar_hide_button" class="hide_button expanding_button btn btn-secondary btn-sm active" title="Hide section">▲<span class="expanding_text"> Hide</span></button> ' +
                '<button id="' + character + '_weeklychar_unhide_button" class="unhide_button expanding_button btn btn-secondary btn-sm active" title="Unhide Section">▼<span class="expanding_text"> Unhide</span></button> ' +
                '<button id="' + character + '_weeklychar_reset_button" class="reset_button expanding_button btn btn-secondary btn-sm active" title="Completely reset checked items, hiding and order to default">↺<span class="expanding_text"> Reset</span></button> ' +
                '<button id="character-delete" class="btn btn-danger btn-sm active expanding_button" data-character="' + character + '" title="Delete ' + character + '">⊘<span class="expanding_text"> Delete ' + character + '?</span></button>' +
                '</td>' +
                '</tr>' +
                '</thead>' +
                '<tbody></tbody>' +
                '</table>' +
                '</div>'+
                '</div>'
        }
    }

    //Event listener for deleting character button
    let characterBody = document.getElementById('characters_body');
    let deleteButtons = characterBody.querySelectorAll('#character-delete');
    for (let deleteButton of deleteButtons) {
        deleteButton.addEventListener('click', function (e) {
            e.preventDefault();
            charactersArray = charactersArray.filter(e => e != this.dataset.character);
            if(charactersArray.length == 0){
                storage.removeItem('characters');
            }else{
                storage.setItem('characters', charactersArray.join(','));
            }
            
            let prefix = this.dataset.character == 'default' ? '' : (this.dataset.character + '-');
            for (const timeFrame of timeframesCharacter) {
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
    characterName.addEventListener('keypress', function (e) {
        if (!/^[A-Za-z0-9]+$/.test(e.key)) {
            e.preventDefault();
            return false;
        }
    });

    // Save data on submit
    characterForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let characterNameField = this.querySelector('input#characterName');
        let characterErrorMsg = characterNameField.parentNode.querySelector('.invalid-feedback');

        if (!/^[A-Za-z0-9]+$/.test(characterNameField.value)) {
            characterName.classList.add('is-invalid');
            characterErrorMsg.innerHTML = 'Alpha numeric and no spaces only';
        } else if (charactersArray.includes(characterNameField.value)) {
            characterName.classList.add('is-invalid');
            characterErrorMsg.innerHTML = 'Character already exists';
        } else {
            charactersArray.push(characterNameField.value);
            storage.setItem('characters', charactersArray.join(','));
            window.location.reload();
        }
    });

    characterControl.addEventListener('click', function (e) {
        e.stopPropagation();
    });
}

const layouts = function () {
    const layoutButton = document.getElementById('compact-button');
    let currentLayout = storage.getItem('current-layout') ?? 'default';
    if (currentLayout !== 'default') {
        document.body.classList.add('compact');
        layoutButton.innerHTML = '⊞<span class="expanding_text">&nbsp;Full Mode</span>';
    }

    layoutButton.addEventListener('click', function (e) {
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

const positions = function () {
    keys = Object.keys(localStorage), i = keys.length;
    while(i--){
        var item = keys[i];
        if(item.startsWith('pos_')){
            var element = document.getElementById(item.substring(4))
            element.style.transform = localStorage.getItem(keys[i])
        }
    }
}

const resetPositions = function () {
    const layoutButton = document.getElementById('layout-button');
    layoutButton.addEventListener('click', function (e) {
        e.preventDefault();

        keys = Object.keys(localStorage), i = keys.length;
        while(i--){
            var item = keys[i];
            if(item.startsWith('pos_')){
                localStorage.removeItem(item);
            }
        }
        window.location.reload();
    });
}

/**
 * Make bootstrap 5 dropdown menus collapse after link is clicked
 * old method of adding `data-toggle="collapse" data-target=".navbar-collapse.show"` to the <li>s was preventing navigation by the same element
 */
const dropdownMenuHelper = function () {
    const navLinks = document.querySelectorAll('.nav-item:not(.dropdown), .dropdown-item');
    const menuToggle = document.getElementById('navbarSupportedContent');
    const bsCollapse = new bootstrap.Collapse(menuToggle, {
        toggle: false
    });

    navLinks.forEach(function (l) {
        l.addEventListener('click', function () {
            if (menuToggle.classList.contains('show')) {
                bsCollapse.toggle();
            }
        });
    });
};

window.onload = function () {
    charactersFunction();
    layouts();
    positions();
    resetPositions();

    let charactersStored = storage.getItem('characters');
    if (charactersStored !== null) {
        let characterArray = charactersStored.split(',');

        for (const index in characterArray) {
            character = characterArray[index];
            for (const timeFrame of timeframesCharacter) {
                populateTable(timeFrame, character);
                draggableTable(timeFrame, character);
                checkReset(timeFrame, character);
                resettableSection(timeFrame, character);
                hidableSection(timeFrame, character);
            }
            populateNavigation(index, character);
        }
    }

    for (const timeFrame of timeframesRoster) {
        populateTable(timeFrame, null);
        draggableTable(timeFrame, null);
        checkReset(timeFrame, null);
        resettableSection(timeFrame, null);
        hidableSection(timeFrame, null);
        countDown(timeFrame);
    }

    dropdownMenuHelper();
    tableEventListeners();

    setInterval(function () {
        for (const timeFrame of timeframesRoster) {
            checkReset(timeFrame);
            countDown(timeFrame);
        }
        for (const timeFrame of timeframesCharacter) {
            let characterArray = charactersStored.split(',');
            for (const index in characterArray) {
                character = characterArray[index];
                checkReset(timeFrame, character);
            }
        }
    }, 1000);
};
