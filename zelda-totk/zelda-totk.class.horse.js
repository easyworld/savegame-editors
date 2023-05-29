/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Horse class) v20230526

	by Marc Robledo 2023
	horse data thanks to JonJaded, Ozymandias07 and Karlos007
*/

function Horse(index, id, name, mane, saddles, reins, bond, specialType, statsStrength, statsSpeed, statsStamina, statsPull, iconPattern, iconEyeColor){
	this.category='horses';
	this.index=index;

	this.id=id;
	this.name=name;
	this.mane=mane;
	this.saddles=saddles;
	this.reins=reins;
	this.bond=bond;
	this.specialType=specialType;
	this.statsStrength=statsStrength;
	this.statsSpeed=statsSpeed;
	this.statsStamina=statsStamina;
	this.statsPull=statsPull;
	this.iconPattern=iconPattern;
	this.iconEyeColor=iconEyeColor;

	if(
		specialType!==Horse.TYPE_NORMAL && 
		specialType!==Horse.TYPE_ZELDA &&
		specialType!==Horse.TYPE_EPONA &&
		specialType!==Horse.TYPE_GIANT_BLACK &&
		specialType!==Horse.TYPE_GIANT_WHITE &&
		specialType!==Horse.TYPE_SPOT &&
		specialType!==Horse.TYPE_GOLD
	)
		console.warn('unknown horse['+index+'].specialType value: '+specialType);

	Horse.buildHtmlElements(this);
	this.fixValues(true);
}


Horse.prototype.fixValues=function(ignoreEquipment){
	if(this.id==='GameRomHorseZelda'){
		this.specialType=Horse.TYPE_ZELDA;
		this._htmlSelectIconPattern.disabled=true;
		this._htmlSelectIconEyeColor.disabled=true;
		//this.temperament='wild';
	}else if(this.id==='GameRomHorse00L'){
		this.specialType=Horse.TYPE_GIANT_BLACK;
		if(!ignoreEquipment){
			this.mane=this._htmlSelectMane.value=0x9cd4f27b;
			this.saddles=this._htmlSelectSaddles.value=0xf1435392;
			this.reins=this._htmlSelectReins.value=0x4dbf2061;
		}
		this._htmlSelectIconPattern.disabled=true;
		this._htmlSelectIconEyeColor.disabled=true;
		//this.temperament='wild';
	}else if(this.id==='GameRomHorse01L'){
		this.specialType=Horse.TYPE_GIANT_WHITE;
		if(!ignoreEquipment){
			this.mane=this._htmlSelectMane.value=0x55365b10;
			this.saddles=this._htmlSelectSaddles.value=0xf1435392;
			this.reins=this._htmlSelectReins.value=0x4dbf2061;
		}
		this._htmlSelectIconPattern.disabled=true;
		this._htmlSelectIconEyeColor.disabled=true;
		//this.temperament='wild';
	}else if(this.id==='GameRomHorseSpPattern'){
		this.specialType=Horse.TYPE_SPOT;
		this._htmlSelectIconPattern.disabled=true;
		this._htmlSelectIconEyeColor.disabled=true;
		//this.temperament='wild'; //???
	}else if(this.id==='GameRomHorseGold'){
		this.specialType=Horse.TYPE_GOLD;
		this._htmlSelectIconPattern.disabled=true;
		this._htmlSelectIconEyeColor.disabled=true;
		//this.temperament='wild'; //???
	}else if(this.id==='GameRomHorseEpona'){
		this.specialType=Horse.TYPE_EPONA;
		this._htmlSelectIconPattern.disabled=true;
		this._htmlSelectIconEyeColor.disabled=true;
		//this.temperament='wild'; //???
	}else{
		this.specialType=Horse.TYPE_NORMAL;
		if(!ignoreEquipment && this.id==='GameRomHorse00S'){
			this.mane=this._htmlSelectMane.value=0xbad4c4a9;
			this.saddles=this._htmlSelectSaddles.value=0x8c5bd272;
			this.reins=this._htmlSelectReins.value=0xe8fe6ab7;
		}
		this._htmlSelectIconPattern.disabled=false;
		this._htmlSelectIconEyeColor.disabled=false;
		//this.temperament='gentle'; //???
	}
}
Horse.prototype.getItemTranslation=function(){
	return Horse.TRANSLATIONS[this.id] || this.id;
}
Horse.prototype.save=function(){
	SavegameEditor.writeString64('ArrayHorseIds', this.index, this.id);
	SavegameEditor.writeStringUTF8('ArrayHorseNames', this.index, this.name);
	SavegameEditor.writeU32('ArrayHorseManes', this.index, this.mane);
	SavegameEditor.writeU32('ArrayHorseSaddles', this.index, this.saddles);
	SavegameEditor.writeU32('ArrayHorseReins', this.index, this.reins);
	SavegameEditor.writeF32('ArrayHorseBonds', this.index, this.bond);
	SavegameEditor.writeU32('ArrayHorseSpecialTypes', this.index, this.specialType);
	SavegameEditor.writeU32('ArrayHorseStatsStrength', this.index, this.statsStrength);
	SavegameEditor.writeU32('ArrayHorseStatsSpeed', this.index, this.statsSpeed);
	SavegameEditor.writeU32('ArrayHorseStatsStamina', this.index, this.statsStamina);
	SavegameEditor.writeU32('ArrayHorseStatsPull', this.index, this.statsPull);
	SavegameEditor.writeU32('ArrayHorseIconPatterns', this.index, this.iconPattern);
	SavegameEditor.writeU32('ArrayHorseIconEyeColors', this.index, this.iconEyeColor);
}

Horse.buildHtmlElements=function(item){
	//build html elements
	item._htmlInputName=input('name-'+item.category+'-'+item.index, item.name);
	item._htmlInputName.addEventListener('change', function(){
		var newVal=this.value;
		if(newVal.length>9)
			newVal=newVal.substr(0,9);
		if(!newVal)
			newVal='a';
		item.name=newVal;
	});
	item._htmlInputName.title='马的名字';
	item._htmlInputName.maxLength=9;

	item._htmlSelectMane=select('horse-mane-'+item.index, Horse.MANES, function(){
		item.mane=this.value;
	}, item.mane);
	item._htmlSelectMane.title='鬃毛';

	item._htmlSelectSaddles=select('horse-saddles-'+item.index, Horse.SADDLES, function(){
		item.saddles=this.value;
	}, item.saddles);
	item._htmlSelectSaddles.title='马鞍';

	item._htmlSelectReins=select('horse-reins-'+item.index, Horse.REINS, function(){
		item.reins=this.value;
	}, item.reins);
	item._htmlSelectReins.title='缰绳';

	item._htmlInputBond=inputFloat('bond-'+item.category+'-'+item.index,0,100,item.bond*100);
	item._htmlInputBond.addEventListener('change', function(){
		item.bond=parseFloat(this.value) / 100;
	});
	item._htmlInputBond.title='友好度';


	var stats=[
		{value:1, name:'★★'},
		{value:2, name:'★★★'},
		{value:3, name:'★★★★'},
		{value:4, name:'★★★★★'}
	];
	var statsStamina=[
		{value:2, name:'★★'},
		{value:3, name:'★★★'},
		{value:4, name:'★★★★'},
		{value:5, name:'★★★★★'},
		{value:0, name:'无限'}
	];
	item._htmlInputStatsStrength=inputNumber('horse-stats-strength-'+item.index,100,350,item.statsStrength);
	item._htmlInputStatsStrength.addEventListener('change', function(){
		item.statsStrength=parseInt(this.value);
	});
	item._htmlInputStatsStrength.title='状态: 健壮度';
	item._htmlSelectStatsSpeed=select('horse-stats-speed-'+item.index, stats, function(){
		item.statsSpeed=parseInt(this.value);
	}, item.statsSpeed);
	item._htmlSelectStatsSpeed.title='状态: 速度';
	item._htmlSelectStatsStamina=select('horse-stats-stamina-'+item.index, statsStamina, function(){
		item.statsStamina=parseInt(this.value);
	}, item.statsStamina);
	item._htmlSelectStatsStamina.title='状态: 精力';
	item._htmlSelectStatsPull=select('horse-stats-pull-'+item.index, stats, function(){
		item.statsPull=parseInt(this.value);
	}, item.statsPull);
	item._htmlSelectStatsPull.title='状态: 挽力';




	item._htmlSelectIconPattern=select('horse-icon-pattern-'+item.index, Horse.ICON_PATTERNS, function(){
		item.iconPattern=parseInt(this.value);
	}, item.iconPattern);
	item._htmlSelectIconPattern.title='头像类型';

	item._htmlSelectIconEyeColor=select('horse-icon-eye-color-'+item.index, Horse.ICON_EYE_COLORS, function(){
		item.iconEyeColor=parseInt(this.value);
	}, item.iconEyeColor);
	item._htmlSelectIconEyeColor.title='头像眼睛颜色';
}

Horse.readAll=function(){
	var horsesIds=SavegameEditor.readString64Array('ArrayHorseIds');
	var validHorses=[];
	for(var i=0; i<horsesIds.length; i++){
		if(horsesIds[i]){
			validHorses.push(new Horse(
				i,
				horsesIds[i],
				SavegameEditor.readStringUTF8('ArrayHorseNames', i),
				SavegameEditor.readU32('ArrayHorseManes', i),
				SavegameEditor.readU32('ArrayHorseSaddles', i),
				SavegameEditor.readU32('ArrayHorseReins', i),
				SavegameEditor.readF32('ArrayHorseBonds', i),
				SavegameEditor.readU32('ArrayHorseSpecialTypes', i),
				SavegameEditor.readU32('ArrayHorseStatsStrength', i),
				SavegameEditor.readU32('ArrayHorseStatsSpeed', i),
				SavegameEditor.readU32('ArrayHorseStatsStamina', i),
				SavegameEditor.readU32('ArrayHorseStatsPull', i),
				SavegameEditor.readU32('ArrayHorseIconPatterns', i),
				SavegameEditor.readU32('ArrayHorseIconEyeColors', i)
			));
		}
	}
	return validHorses;
}

Horse.TRANSLATIONS={
	'GameRomHorse00':'马 00',
	'GameRomHorse01':'马 01',
	'GameRomHorse02':'马 02',
	'GameRomHorse03':'马 03',
	'GameRomHorse04':'马 04',
	'GameRomHorse05':'马 05',
	'GameRomHorse06':'马 06',
	'GameRomHorse07':'马 07',
	'GameRomHorse08':'马 08',
	'GameRomHorse09':'马 09',
	'GameRomHorse10':'马 10',
	'GameRomHorse11':'马 11',
	'GameRomHorse12':'马 12',
	'GameRomHorse13':'马 13',
	'GameRomHorse14':'马 14',
	'GameRomHorse15':'马 15',
	'GameRomHorse16':'马 16',
	'GameRomHorse17':'马 17',
	'GameRomHorse18':'马 18',
	'GameRomHorse19':'马 19',
	'GameRomHorse20':'马 20',
	'GameRomHorse21':'马 21',
	'GameRomHorse22':'马 22',
	'GameRomHorse23':'马 23',
	'GameRomHorse25':'马 25',
	'GameRomHorse26':'马 26',
	'GameRomHorseEpona':'伊波娜 (amiibo)',
	'GameRomHorseZelda':'白马',
	'GameRomHorse00L':'巨马',
	'GameRomHorse01L':'巨身白马',
	'GameRomHorseGold':'金色马',
	'GameRomHorseSpPattern':'斑点',

	//untammable
	//'GameRomHorse00S':'*Donkey',
	'GameRomHorseBone':'*骷髅马',
	'GameRomHorseBone_AllDay':'*骷髅马 (白天)',
	'GameRomHorseForStreetVender':'*商人马',
	'GameRomHorseNushi':'*萨托利',
	'Animal_Bear_A':'*食蜂熊',
	'Animal_Bear_B':'*帝灰熊'
};


Horse.TYPE_NORMAL=1; //normal
Horse.TYPE_ZELDA=3; //Royal White Stallion
Horse.TYPE_EPONA=4; //Epona
Horse.TYPE_GIANT_BLACK=2; //00L (Giant Black Stallion)
Horse.TYPE_GIANT_WHITE=13; //01L (Giant White Stallion)
Horse.TYPE_GOLD=12; //Gold
Horse.TYPE_SPOT=8; //SpPattern

Horse.ICON_PATTERNS=[
	{value:0x8ff7b62d, name:'00'}, //00
	{value:0x61ec6600, name:'01'}, //01
	{value:0x43caa47b, name:'02'}, //02
	{value:0xb8872476, name:'03'}, //03
	{value:0xfdcaa775, name:'04'}, //04
	{value:0xb28f2118, name:'05'}, //05
	{value:0xe7fc193e, name:'06 (特殊: 金色)'}, //06	
];
Horse.ICON_EYE_COLORS=[
	{value:0x6cbc3cb4, name:'黑色'},
	{value:0xe2911aba, name:'蓝色'}
];
Horse.MANES=[
	{value:0xb6eede09, name:'无'}, //None
	{value:0xb93d9e3b, name:'普通鬃毛'}, //Horse_Link_Mane
	{value:0x3a84d601, name:'长鬃毛'}, //Horse_Link_Mane_01
	{value:0x0bffd92a, name:'莫西干式鬃毛'}, //Horse_Link_Mane_02
	{value:0xe8125091, name:'八股辫鬃毛'}, //Horse_Link_Mane_03
	{value:0xfdb103b2, name:'三股辫鬃毛'}, //Horse_Link_Mane_04
	{value:0x75677ada, name:'红色长鬃毛'}, //Horse_Link_Mane_05
	{value:0x9cbf81f2, name:'蓝色长鬃毛'}, //Horse_Link_Mane_06
	{value:0x8140f2f9, name:'绿色长鬃毛'}, //Horse_Link_Mane_07
	{value:0xd749201c, name:'紫色长鬃毛'}, //Horse_Link_Mane_08
	{value:0xac2a896d, name:'簪花鬃毛'}, //Horse_Link_Mane_09
	{value:0x87d9391f, name:'鬃毛 10'}, //Horse_Link_Mane_10
	{value:0xd6a61738, name:'鬃毛 11'}, //Horse_Link_Mane_11
	{value:0x12dd95d6, name:'鬃毛 12'}, //Horse_Link_Mane_12
	{value:0x9cd4f27b, name:'巨马黑鬃毛'}, //Horse_Link_Mane_00L
	{value:0x55365b10, name:'巨马白鬃毛'}, //Horse_Link_Mane_01L
	{value:0xbad4c4a9, name:'*驴鬃毛'} //Horse_Link_Mane_00S
];
Horse.SADDLES=[
	//{value:0xb6eede09, name:'None'}, //None
	{value:0x8573ae34, name:'驿站协会马鞍'}, //GameRomHorseSaddle_00
	{value:0x04c6c17b, name:'旅人马鞍'}, //GameRomHorseSaddle_01
	{value:0x47d0c84e, name:'王族马鞍'}, //GameRomHorseSaddle_02
	{value:0xaeab565a, name:'骑士马鞍'}, //GameRomHorseSaddle_03
	{value:0xcf167805, name:'怪物马鞍'}, //GameRomHorseSaddle_04
	{value:0x6e2db559, name:'奢华马鞍'}, //GameRomHorseSaddle_05
	{value:0xb926ed8b, name:'牵引挽具'}, //GameRomHorseSaddle_07
	{value:0xf1435392, name:'巨马马鞍'}, //GameRomHorseSaddle_00L
	{value:0x7feaa5c0, name:'*马鞍 06'}, //GameRomHorseSaddle_06
	{value:0x8c5bd272, name:'*驴马鞍'} //GameRomHorseSaddle_00S
	//{value:0xdeadbeef, name:'*Saddle 07_ExternalCoupler'}, //GameRomHorseSaddle_07_ExternalCoupler
	//{value:0xdeadbeef, name:'*Towing Harness (+ wagon)'}, //GameRomHorseSaddle_07_WithWagon
	//{value:0xdeadbeef, name:'*Saddle 00S_AncientAssistant'} //GameRomHorseSaddle_00S_AncientAssistant
];
Horse.REINS=[
	//{value:0xb6eede09, name:'None'}, //None
	{value:0x1864234b, name:'驿站协会缰绳'}, //GameRomHorseReins_00
	{value:0x094f807a, name:'旅人缰绳'}, //GameRomHorseReins_01
	{value:0xe54abe55, name:'王族缰绳'}, //GameRomHorseReins_02
	{value:0x0200441d, name:'骑士缰绳'}, //GameRomHorseReins_03
	{value:0x85610de7, name:'怪物缰绳'}, //GameRomHorseReins_04
	{value:0xbdc6a58b, name:'奢华缰绳'}, //GameRomHorseReins_05
	{value:0x4dbf2061, name:'巨马缰绳'}, //GameRomHorseReins_00L
	{value:0x79c2c72f, name:'*缰绳 06'}, //GameRomHorseReins_06
	{value:0xe8fe6ab7, name:'*驴缰绳'} //GameRomHorseReins_00S
];
