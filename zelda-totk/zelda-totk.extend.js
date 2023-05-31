SavegameEditor['addMissingItem'] = function (catId) {
    var categoryHash = capitalizeCategoryId(catId);
    var maxItems = SavegameEditor.readU32('Array' + categoryHash + 'Ids');

    empty('container-' + catId);
    SavegameEditor.currentItems[catId] = [];

    var itemList = this.getTranslationHash(catId);
    var index = 0;
    for (id in itemList) {
        var newItem;
        if (catId === 'materials' || catId === 'food' || catId === 'devices') {
            newItem = new Item(catId, index++, id, 888);
        } else if (catId === 'armors') {
            if (itemList[id].includes('(')) continue;
            var has4Star;
            if (itemList[id].endsWith('★'))
                has4Star = Object.values(itemList).some(value => value.includes(itemList[id].replaceAll('★', '') + '★★★★'));
            else
                has4Star = Object.values(itemList).some(value => value.includes(itemList[id] + ' ★★★★'));
            if (has4Star && itemList[id].includes('★★★★') || !has4Star)
                newItem = new Armor(index++, id);
            else
                continue;
        }
        newItem.removable = true;
        this.currentItems[catId].push(newItem);
        var row = this._createItemRow(newItem);
        document.getElementById('container-' + newItem.category).appendChild(row);
        lastItem = this.getLastItem(catId);
    };
    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

SavegameEditor['exportItem'] = function (catId) {
    if (!SavegameEditor.currentItems[catId]) return;
    var data = SavegameEditor.currentItems[catId];
    var exportJson = [];
    if (catId === 'weapons' || catId === 'bows' || catId === 'shields') {
        // catId, index, id, durability, modifier, modifierValue, fuseId
        for (let i = 0; i < data.length; i++) {
            var equipment = { catId: data[i].catId, index: data[i].index, id: data[i].id, durability: data[i].durability, modifier: data[i].modifier, modifierValue: data[i].modifierValue, fuseId: data[i].fuseId };
            exportJson.push(equipment);
        }
    } else if (catId === 'armors') {
        // index, id, dyeColor
        for (let i = 0; i < data.length; i++) {
            var armor = { index: data[i].index, id: data[i].id, dyeColor: data[i].dyeColor };
            exportJson.push(armor);
        }
    } else if (catId === 'arrows' || catId === 'materials' || catId === 'food' || catId === 'devices' || catId === 'key') {
        // catId, index, id, quantity, foodEffect, foodEffectHearts, foodEffectMultiplier, foodEffectTime, foodEffectUnknown1
        for (let i = 0; i < data.length; i++) {
            var item = { catId: data[i].catId, index: data[i].index, id: data[i].id, quantity: data[i].quantity, foodEffect: data[i].foodEffect, foodEffectHearts: data[i].foodEffectHearts, foodEffectMultiplier: data[i].foodEffectMultiplier, foodEffectTime: data[i].foodEffectTime, foodEffectUnknown1: data[i].foodEffectUnknown1 };
            exportJson.push(item);
        }
    }
    var exportString = JSON.stringify(exportJson);
    var exportBlob = new Blob([exportString], { type: 'application/json' });
    var exportUrl = URL.createObjectURL(exportBlob);
    var exportLink = document.createElement('a');
    exportLink.href = exportUrl;
    exportLink.download = catId + '.json';
    document.body.appendChild(exportLink);
    exportLink.click();
}

function importItem(event, catId) {
    if (!SavegameEditor.currentItems[catId]) return;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        let text = e.target.result;
        let a = JSON.parse(text);
        console.log(a);
        empty('container-' + catId);
        if (catId === 'weapons' || catId === 'bows' || catId === 'shields') {
            let pounchSize = a.length;
            let name = (catId == 'weapons') ? 'swords' : catId;
            setValue('number-pouch-size-'+name, pounchSize);
        }
        
        for (let i = 0; i < a.length; i++) {
            var newItem;
            if (catId === 'weapons' || catId === 'bows' || catId === 'shields') {
                newItem = new Equipment(catId, a[i].index, a[i].id, a[i].durability, a[i].modifier, a[i].modifierValue, a[i].fuseId);
            } else if (catId === 'armors') {
                newItem = new Armor(a[i].index, a[i].id, a[i].dyeColor);
            } else if (catId === 'arrows' || catId === 'materials' || catId === 'food' || catId === 'devices' || catId === 'key') {
                newItem = new Item(catId, a[i].index, a[i].id, a[i].quantity, a[i].foodEffect, a[i].foodEffectHearts, a[i].foodEffectMultiplier, a[i].foodEffectTime, a[i].foodEffectUnknown1);
            }
            newItem.removable = true;
            SavegameEditor.currentItems[catId].push(newItem);
            var row = SavegameEditor._createItemRow(newItem);
            document.getElementById('container-' + newItem.category).appendChild(row);
        }
    };
    reader.readAsText(file);
}