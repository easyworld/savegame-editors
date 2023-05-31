/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Equipment class) v20230528

	by Marc Robledo 2023
	item names compiled by Echocolat, Exincracci, HylianLZ and Karlos007
*/

function Equipment(catId, index, id, durability, modifier, modifierValue, fuseId){ //Weapon, Bow or Shield
	this.category=catId;
	this.index=index;
	this.removable=false;

	this.id=id;
	this.durability=durability || 70;
	this.modifier=modifier || Equipment.MODIFIER_NO_BONUS;
	this.modifierValue=modifierValue || 0;
	if(this.isFusable()){
		this.fuseId=fuseId || '';
	}

	Equipment.buildHtmlElements(this);
}
Equipment.prototype.getItemTranslation=function(){
	return Equipment.TRANSLATIONS[this.category][this.id] || this.id;
}
Equipment.prototype.isFusable=function(){
	return (this.category==='weapons' || this.category==='shields')
}
Equipment.prototype.restoreDurability=function(){
	this.durability=this.getMaximumDurability();
	this._htmlInputDurability.value=this.durability;
}
Equipment.prototype.getMaximumDurability=function(){
	var defaultDurability=Equipment.DEFAULT_DURABILITY[this.id] || 70;
	if(this.isFusable() && this.fuseId){
		if(Equipment.DEFAULT_DURABILITY[this.fuseId]){
			defaultDurability+=Equipment.DEFAULT_DURABILITY[this.fuseId];
		}else{
			defaultDurability+=25;
		}
	}

	if(this.modifier===Equipment.MODIFIER_DURABILITY || this.modifier===Equipment.MODIFIER_DURABILITY2) //Durability ↑/↑↑
		return defaultDurability + this.modifierValue + 2100000000;
	return defaultDurability + 2100000000;
}
Equipment.prototype.copy=function(index, newId){
	return new Equipment(
		this.category,
		index,
		typeof newId==='string'? newId : this.id,
		this.durability,
		this.modifier,
		this.modifierValue,
		this.isFusable()? this.fuseId : null
	);
}
Equipment.prototype.save=function(){
	var categoryHash=capitalizeCategoryId(this.category);
	SavegameEditor.writeString64('Array'+categoryHash+'Ids', this.index, this.id);
	SavegameEditor.writeU32('Array'+categoryHash+'Durabilities', this.index, this.durability);
	SavegameEditor.writeU32('Array'+categoryHash+'Modifiers', this.index, this.modifier);
	SavegameEditor.writeU32('Array'+categoryHash+'ModifierValues', this.index, this.modifierValue);

	if(this.isFusable())
		SavegameEditor.writeString64('Array'+categoryHash+'FuseIds', this.index, this.fuseId);
}


Equipment.buildHtmlElements=function(item){
	//build html elements
	item._htmlInputDurability=inputNumber('item-durability-'+item.category+'-'+item.index, 1, 70, item.durability);
	item._htmlInputDurability.addEventListener('change', function(){
		var newVal=parseInt(this.value);
		if(!isNaN(newVal) && newVal>0)
			item.durability=newVal;
	});
	item._htmlInputDurability.title='耐久值';
	item._htmlInputDurability.maxValue=item.getMaximumDurability();
	item._htmlInputDurability.value=item.durability;

	//build html elements
	var modifiers=[
		{name:'无', value:Equipment.MODIFIER_NO_BONUS},
		{name:'攻击力提升', value:Equipment.MODIFIER_ATTACK},
		{name:'攻击力提升大', value:Equipment.MODIFIER_ATTACK2},
		{name:'耐用度提升', value:Equipment.MODIFIER_DURABILITY},
		{name:'耐用度提升大', value:Equipment.MODIFIER_DURABILITY2}
	];
	if(item.category==='weapons'){
		modifiers.push({name:'结束暴击', value:Equipment.MODIFIER_CRITICAL_HIT});
		modifiers.push({name:'远距离投掷', value:Equipment.MODIFIER_THROW});
	}else if(item.category==='bows'){
		modifiers.push({name:'速射', value:Equipment.MODIFIER_QUICK_SHOT});
		//modifiers.push({name:'Arrow Shot x3', value:Equipment.MODIFIER_ARROWX3}); //???
		modifiers.push({name:'5连发', value:Equipment.MODIFIER_ARROWX5});
	}else if(item.category==='shields'){
		modifiers.push({name:'盾防护提升', value:Equipment.MODIFIER_BLOCK});
		modifiers.push({name:'盾防护提升大', value:Equipment.MODIFIER_BLOCK2});
	}
	var unknownModifier=[
		Equipment.MODIFIER_NO_BONUS,
		Equipment.MODIFIER_ATTACK,
		Equipment.MODIFIER_ATTACK2,
		Equipment.MODIFIER_DURABILITY,
		Equipment.MODIFIER_DURABILITY2,
		Equipment.MODIFIER_CRITICAL_HIT,
		Equipment.MODIFIER_THROW,
		Equipment.MODIFIER_QUICK_SHOT,
		Equipment.MODIFIER_ARROWX3,
		Equipment.MODIFIER_ARROWX5,
		Equipment.MODIFIER_BLOCK,
		Equipment.MODIFIER_BLOCK2
	].indexOf(item.modifier)===-1;
	if(unknownModifier){
		modifiers.push({name:'未知: '+item.modifier.toString(16), value:item.modifier});
	}
	item._htmlSelectModifier=select('item-modifier-'+item.category+'-'+item.index, modifiers, function(){
		var fromNoBonus=item.modifier===Equipment.MODIFIER_NO_BONUS;
		var fromModifierDurability=item.modifier===Equipment.MODIFIER_DURABILITY || item.modifier===Equipment.MODIFIER_DURABILITY2;
		item.modifier=parseInt(this.value);
		
		var maximumDurability=item.getMaximumDurability();
		get('number-item-durability-'+item.category+'-'+item.index).maxValue=maximumDurability;

		if(item.modifier===Equipment.MODIFIER_NO_BONUS){
			item.modifierValue=0;
			item._htmlInputModifierValue.value=0;
			item.restoreDurability();
		}else if(fromNoBonus || fromModifierDurability){
			if(fromNoBonus && (item.modifier===Equipment.MODIFIER_DURABILITY || item.modifier===Equipment.MODIFIER_DURABILITY2)){
				item.modifierValue=2100000000;
				item._htmlInputModifierValue.value=2100000000;
			}
			item.restoreDurability();
		}
	}, item.modifier);
	item._htmlSelectModifier.title='修改的类型';
	item._htmlSelectModifier.disabled=unknownModifier;

	//build html elements
	item._htmlInputModifierValue=inputNumber('item-modifier-value-'+item.category+'-'+item.index, 0, 2100000000, item.modifierValue);
	item._htmlInputModifierValue.addEventListener('change', function(){
		var newVal=parseInt(this.value);
		if(!isNaN(newVal) && newVal>0){
			item.modifierValue=newVal;
			if((item.modifier===Equipment.MODIFIER_DURABILITY || item.modifier===Equipment.MODIFIER_DURABILITY2)){
				item.restoreDurability();
			}
		}
	});
	item._htmlInputModifierValue.title='修改的值';

	//build html elements
	if(item.isFusable()){
		item._htmlSelectFusion=select('item-fusion-'+item.category+'-'+item.index, Equipment.FUSABLE_ITEMS, function(){
			item.fuseId=this.value;
		}, item.fuseId);
		item._htmlSelectFusion.title='余料建造';
	}
}

Equipment.readAll=function(catId){
	var categoryHash=capitalizeCategoryId(catId);
	var equipmentIds=SavegameEditor.readString64Array('Array'+categoryHash+'Ids');
	var isFusable=(catId==='weapons' || catId==='shields');
	var validEquipment=[];
	for(var i=0; i<equipmentIds.length; i++){
		if(equipmentIds[i]){
			validEquipment.push(new Equipment(
				catId,
				i,
				equipmentIds[i],
				SavegameEditor.readU32('Array'+categoryHash+'Durabilities', i),
				SavegameEditor.readU32('Array'+categoryHash+'Modifiers', i),
				SavegameEditor.readU32('Array'+categoryHash+'ModifierValues', i),
				isFusable? SavegameEditor.readString64('Array'+categoryHash+'FuseIds', i) : null
			));
		}
	}
	return validEquipment;
}



Equipment.MODIFIER_NO_BONUS=0xb6eede09;
Equipment.MODIFIER_ATTACK=0xa9384c6c;
Equipment.MODIFIER_ATTACK2=0xdad10617;
Equipment.MODIFIER_DURABILITY=0xd5cad39b;
Equipment.MODIFIER_DURABILITY2=0xb2c943ee;
Equipment.MODIFIER_CRITICAL_HIT=0xd0efac53; //Weapon only
Equipment.MODIFIER_THROW=0x9659c804; //Weapon only
Equipment.MODIFIER_QUICK_SHOT=0x7d505bc4; //Bow only
Equipment.MODIFIER_ARROWX3=0x54535b3c; //Bow only
Equipment.MODIFIER_ARROWX5=0x934069cd; //Bow only
Equipment.MODIFIER_BLOCK=0x37eae30f; //Shield only
Equipment.MODIFIER_BLOCK2=0xb3c94e5; //Shield only

Equipment.DEFAULT_DURABILITY={
	Weapon_Sword_001:20,
	Weapon_Sword_002:23,
	Weapon_Sword_003:27,
	Weapon_Sword_019:5,
	Weapon_Sword_020:5,
	Weapon_Sword_021:6,
	Weapon_Sword_022:5,
	Weapon_Sword_024:35,
	Weapon_Sword_025:27,
	Weapon_Sword_027:27,
	Weapon_Sword_029:14,
	Weapon_Sword_031:27,
	Weapon_Sword_041:26,
	Weapon_Sword_043:8,
	Weapon_Sword_044:4,
	Weapon_Sword_047:12,
	Weapon_Sword_051:18,
	Weapon_Sword_052:60,
	Weapon_Sword_057:45,
	Weapon_Sword_058:27,
	Weapon_Sword_059:20,
	Weapon_Sword_070:40,
	Weapon_Sword_101:15,
	Weapon_Sword_103:12,
	Weapon_Sword_105:16,
	Weapon_Sword_106:16,
	Weapon_Sword_107:17,
	Weapon_Sword_108:24,
	Weapon_Sword_109:14,
	Weapon_Sword_112:17,
	Weapon_Sword_113:18,
	Weapon_Sword_114:16,
	Weapon_Sword_124:20,
	Weapon_Sword_125:17,
	Weapon_Sword_127:20,
	Weapon_Sword_129:10,
	Weapon_Sword_131:18,
	Weapon_Sword_147:10,
	Weapon_Sword_161:14,
	Weapon_Sword_163:16,
	Weapon_Sword_164:18,
	Weapon_Sword_166:15,
	Weapon_Sword_167:4,
	Weapon_Sword_168:12,
	Weapon_Sword_077:30,

	Weapon_Lsword_001:20,
	Weapon_Lsword_002:25,
	Weapon_Lsword_003:30,
	Weapon_Lsword_019:5,
	Weapon_Lsword_020:8,
	Weapon_Lsword_024:40,
	Weapon_Lsword_027:30,
	Weapon_Lsword_029:14,
	Weapon_Lsword_036:30,
	Weapon_Lsword_038:8,
	Weapon_Lsword_041:25,
	Weapon_Lsword_045:6,
	Weapon_Lsword_047:12,
	Weapon_Lsword_051:40,
	Weapon_Lsword_054:40,
	Weapon_Lsword_057:50,
	Weapon_Lsword_059:60,
	Weapon_Lsword_060:35,
	Weapon_Lsword_101:15,
	Weapon_Lsword_103:14,
	Weapon_Lsword_106:16,
	Weapon_Lsword_108:26,
	Weapon_Lsword_109:16,
	Weapon_Lsword_112:17,
	Weapon_Lsword_113:18,
	Weapon_Lsword_114:18,
	Weapon_Lsword_124:20,
	Weapon_Lsword_127:20,
	Weapon_Lsword_129:10,
	Weapon_Lsword_136:18,
	Weapon_Lsword_147:11,
	Weapon_Lsword_161:14,
	Weapon_Lsword_163:16,
	Weapon_Lsword_164:18,
	Weapon_Lsword_166:14,
	Weapon_Lsword_168:14,
	Weapon_Lsword_174:18,
	Weapon_Spear_001:30,
	Weapon_Spear_002:35,
	Weapon_Spear_003:40,
	Weapon_Spear_021:12,
	Weapon_Spear_022:12,
	Weapon_Spear_024:50,
	Weapon_Spear_025:35,
	Weapon_Spear_027:40,
	Weapon_Spear_029:20,
	Weapon_Spear_030:26,
	Weapon_Spear_032:35,
	Weapon_Spear_036:8,
	Weapon_Spear_038:12,
	Weapon_Spear_047:15,
	Weapon_Spear_050:70,
	Weapon_Spear_101:22,
	Weapon_Spear_103:18,
	Weapon_Spear_106:24,
	Weapon_Spear_108:34,
	Weapon_Spear_109:22,
	Weapon_Spear_112:25,
	Weapon_Spear_113:26,
	Weapon_Spear_124:30,
	Weapon_Spear_125:24,
	Weapon_Spear_127:26,
	Weapon_Spear_129:15,
	Weapon_Spear_132:25,
	Weapon_Spear_147:14,
	Weapon_Spear_161:14,
	Weapon_Spear_163:24,
	Weapon_Spear_164:27,
	Weapon_Spear_166:16,
	Weapon_Spear_168:18,
	Weapon_Spear_173:20,

	Weapon_Bow_001:22,
	Weapon_Bow_002:36,
	Weapon_Bow_003:20,
	Weapon_Bow_004:16,
	Weapon_Bow_006:25,
	Weapon_Bow_009:30,
	Weapon_Bow_011:35,
	Weapon_Bow_013:35,
	Weapon_Bow_014:40,
	Weapon_Bow_015:40,
	Weapon_Bow_016:30,
	Weapon_Bow_017:35,
	Weapon_Bow_026:35,
	Weapon_Bow_027:30,
	Weapon_Bow_028:60,
	Weapon_Bow_029:45,
	Weapon_Bow_030:50,
	Weapon_Bow_032:45,
	Weapon_Bow_033:20,
	Weapon_Bow_035:48,
	Weapon_Bow_036:60,
	Weapon_Bow_038:20,
	Weapon_Bow_040:18,
	Weapon_Bow_072:40,
	Weapon_Bow_101:50,
	Weapon_Bow_104:18,
	Weapon_Bow_105:26,
	Weapon_Bow_106:34,
	Weapon_Bow_107:20,
	Weapon_Bow_166:42,

	Weapon_Shield_001:12,
	Weapon_Shield_002:16,
	Weapon_Shield_003:23,
	Weapon_Shield_004:5,
	Weapon_Shield_005:7,
	Weapon_Shield_006:8,
	Weapon_Shield_007:8,
	Weapon_Shield_008:12,
	Weapon_Shield_009:15,
	Weapon_Shield_016:12,
	Weapon_Shield_017:15,
	Weapon_Shield_018:20,
	Weapon_Shield_021:16,
	Weapon_Shield_022:29,
	Weapon_Shield_023:18,
	Weapon_Shield_025:20,
	Weapon_Shield_026:20,
	Weapon_Shield_030:800,
	Weapon_Shield_031:10,
	Weapon_Shield_032:10,
	Weapon_Shield_033:14,
	Weapon_Shield_034:12,
	Weapon_Shield_035:12,
	Weapon_Shield_036:26,
	Weapon_Shield_037:60,
	Weapon_Shield_040:10,
	Weapon_Shield_041:16,
	Weapon_Shield_042:16,
	Weapon_Shield_057:90,
	Weapon_Shield_101:15,
	Weapon_Shield_102:15,
	Weapon_Shield_103:20,
	Weapon_Shield_107:12,
};

Equipment.TRANSLATIONS={
'weapons':{
Weapon_Sword_001:'旅人之剑',
Weapon_Sword_002:'士兵之剑',
Weapon_Sword_003:'骑士之剑',
Weapon_Sword_019:'波克布林之骨',
Weapon_Sword_020:'蜥蜴战士之骨',
Weapon_Sword_021:'生锈的剑',
Weapon_Sword_022:'木汤勺',
Weapon_Sword_024:'王族之剑',
Weapon_Sword_025:'森民之剑',
Weapon_Sword_027:'卓拉之剑',
Weapon_Sword_029:'格鲁德匕首',
Weapon_Sword_031:'斩风羽剑',
Weapon_Sword_041:'戒心小刀',
Weapon_Sword_043:'火把',
Weapon_Sword_044:'木枝',
Weapon_Sword_047:'近卫之剑',
Weapon_Sword_051:'回旋镖',
Weapon_Sword_052:'七宝匕首',
Weapon_Sword_057:'天空的白刃剑',
Weapon_Sword_058:'初始之剑',
Weapon_Sword_059:'海风回旋镖',
Weapon_Sword_070:'大师之剑',
Weapon_Sword_101:'左纳尼乌姆之剑',
Weapon_Sword_103:'木棒',
Weapon_Sword_105:'回旋镖',
Weapon_Sword_106:'旅人之剑(腐朽)',
Weapon_Sword_107:'蜥蜴回旋镖',
Weapon_Sword_108:'结实木棒',
Weapon_Sword_109:'多节木棒',
Weapon_Sword_112:'士兵之剑(腐朽)',
Weapon_Sword_113:'骑士之剑(腐朽)',
Weapon_Sword_114:'戒心小刀(腐朽)',
Weapon_Sword_124:'王族之剑(腐朽)',
Weapon_Sword_125:'森民之剑(腐朽)',
Weapon_Sword_127:'卓拉之剑(腐朽)',
Weapon_Sword_129:'格鲁德匕首(腐朽)',
Weapon_Sword_131:'斩风羽剑(腐朽)',
Weapon_Sword_147:'近卫之剑(腐朽)',
Weapon_Sword_161:'魔法杖',
Weapon_Sword_163:'左纳尼乌姆之强剑',
Weapon_Sword_164:'左纳尼乌姆之刚剑',
Weapon_Sword_166:'瘴气之剑',
Weapon_Sword_167:'木枝(空岛)',
Weapon_Sword_168:'木棒(腐朽)',
Weapon_Sword_077:'大师之剑(卡bug出来的)',

Weapon_Lsword_001:'旅人双手剑',
Weapon_Lsword_002:'士兵双手剑',
Weapon_Lsword_003:'骑士双手剑',
Weapon_Lsword_019:'莫力布林之骨',
Weapon_Lsword_020:'生锈的双手剑',
Weapon_Lsword_024:'王族双手剑',
Weapon_Lsword_027:'卓拉大剑',
Weapon_Lsword_029:'格鲁德双手剑',
Weapon_Lsword_036:'劈石剑',
Weapon_Lsword_038:'船桨',
Weapon_Lsword_041:'戒心长刀',
Weapon_Lsword_045:'农用锄头',
Weapon_Lsword_047:'近卫双手剑',
Weapon_Lsword_051:'大回旋镖',
Weapon_Lsword_054:'碎岩巨剑',
Weapon_Lsword_057:'黄昏之大剑',
Weapon_Lsword_059:'大鼓隆之剑',
Weapon_Lsword_060:'鬼神大剑',
Weapon_Lsword_101:'左纳尼乌姆之大剑',
Weapon_Lsword_103:'粗棒',
Weapon_Lsword_106:'旅人双手剑(腐朽)',
Weapon_Lsword_108:'结实粗棒',
Weapon_Lsword_109:'多节粗棒',
Weapon_Lsword_112:'士兵双手剑(腐朽)',
Weapon_Lsword_113:'骑士双手剑(腐朽)',
Weapon_Lsword_114:'戒心长刀(腐朽)',
Weapon_Lsword_124:'王族双手剑(腐朽)',
Weapon_Lsword_127:'卓拉大剑(腐朽)',
Weapon_Lsword_129:'格鲁德双手剑(腐朽)',
Weapon_Lsword_136:'劈石剑(腐朽)',
Weapon_Lsword_147:'近卫双手剑(腐朽)',
Weapon_Lsword_161:'魔法大杖',
Weapon_Lsword_163:'左纳尼乌姆之强大剑',
Weapon_Lsword_164:'左纳尼乌姆之刚大剑',
Weapon_Lsword_166:'瘴气金属棒',
Weapon_Lsword_168:'粗棒(腐朽)',
Weapon_Lsword_174:'大回旋镖(腐朽)',

Weapon_Spear_001:'旅人之枪',
Weapon_Spear_002:'士兵之枪',
Weapon_Spear_003:'骑士之枪',
Weapon_Spear_021:'生锈的枪',
Weapon_Spear_022:'农用钉耙',
Weapon_Spear_024:'王族之枪',
Weapon_Spear_025:'森民之枪',
Weapon_Spear_027:'卓拉之枪',
Weapon_Spear_029:'格鲁德之枪',
Weapon_Spear_030:'投枪',
Weapon_Spear_032:'斩风羽枪',
Weapon_Spear_036:'木拖把',
Weapon_Spear_038:'渔夫的鱼叉',
Weapon_Spear_047:'近卫之枪',
Weapon_Spear_050:'光鳞之枪',
Weapon_Spear_101:'左纳尼乌姆之枪',
Weapon_Spear_103:'长棒',
Weapon_Spear_106:'旅人之枪(腐朽)',
Weapon_Spear_108:'结实长棒',
Weapon_Spear_109:'多节长棒',
Weapon_Spear_112:'士兵之枪(腐朽)',
Weapon_Spear_113:'骑士之枪(腐朽)',
Weapon_Spear_124:'王族之枪(腐朽)',
Weapon_Spear_125:'森民之枪(腐朽)',
Weapon_Spear_127:'卓拉之枪(腐朽)',
Weapon_Spear_129:'格鲁德之枪(腐朽)',
Weapon_Spear_132:'斩风羽枪(腐朽)',
Weapon_Spear_147:'近卫之枪(腐朽)',
Weapon_Spear_161:'魔法长杖',
Weapon_Spear_163:'左纳尼乌姆之强枪',
Weapon_Spear_164:'左纳尼乌姆之刚枪',
Weapon_Spear_166:'瘴气之枪',
Weapon_Spear_168:'长棒(腐朽)',
Weapon_Spear_173:'投枪'
},

'bows':{
Weapon_Bow_001:'旅人之弓',
Weapon_Bow_002:'士兵之弓',
Weapon_Bow_003:'尖刺波克弓',
Weapon_Bow_004:'波克弓',
Weapon_Bow_006:'蜥蜴弓',
Weapon_Bow_009:'莱尼尔之弓',
Weapon_Bow_011:'强力蜥蜴弓',
Weapon_Bow_013:'森民之弓',
Weapon_Bow_014:'卓拉之弓',
Weapon_Bow_015:'格鲁德之弓',
Weapon_Bow_016:'飞燕弓',
Weapon_Bow_017:'游隼弓',
Weapon_Bow_026:'兽王弓',
Weapon_Bow_027:'龙骨波克弓',
Weapon_Bow_028:'大鹫弓',
Weapon_Bow_029:'一心之弓',
Weapon_Bow_030:'钢铁蜥蜴弓',
Weapon_Bow_032:'兽神弓',
Weapon_Bow_033:'近卫之弓',
Weapon_Bow_035:'骑士之弓',
Weapon_Bow_036:'王族之弓',
Weapon_Bow_038:'木之弓',
Weapon_Bow_040:'二连弓',
Weapon_Bow_072:'黄昏之弓',
Weapon_Bow_101:'左纳尼乌姆之弓',
Weapon_Bow_104:'魔像之弓',
Weapon_Bow_105:'魔像之强弓',
Weapon_Bow_106:'魔像之刚弓',
Weapon_Bow_107:'残旧的木之弓',
Weapon_Bow_166:'魔王之弓'
},

'shields':{
Weapon_Shield_001:'木盾',
Weapon_Shield_002:'士兵盾',
Weapon_Shield_003:'骑士盾',
Weapon_Shield_004:'波克盾',
Weapon_Shield_005:'尖刺波克盾',
Weapon_Shield_006:'龙骨波克盾',
Weapon_Shield_007:'蜥蜴盾',
Weapon_Shield_008:'强力蜥蜴盾',
Weapon_Shield_009:'钢铁蜥蜴盾',
Weapon_Shield_016:'莱尼尔盾',
Weapon_Shield_017:'兽王盾',
Weapon_Shield_018:'兽神盾',
Weapon_Shield_021:'生锈的盾',
Weapon_Shield_022:'王族盾',
Weapon_Shield_023:'森民盾',
Weapon_Shield_025:'卓拉盾',
Weapon_Shield_026:'格鲁德盾',
Weapon_Shield_030:'海利亚盾',
Weapon_Shield_031:'兔纹盾',
Weapon_Shield_032:'鱼纹盾',
Weapon_Shield_033:'近卫盾',
Weapon_Shield_034:'兽纹盾',
Weapon_Shield_035:'旅人盾',
Weapon_Shield_036:'太阳盾',
Weapon_Shield_037:'七宝盾',
Weapon_Shield_040:'锅盖',
Weapon_Shield_041:'护心盾',
Weapon_Shield_042:'风筝盾',
Weapon_Shield_057:'海风盾',
Weapon_Shield_101:'左纳尼乌姆之盾',
Weapon_Shield_102:'左纳尼乌姆之硬盾',
Weapon_Shield_103:'左纳尼乌姆之坚盾',
Weapon_Shield_107:'残旧的木盾'
}
};

Equipment.FUSABLE_ITEMS=[
{value:'',name:'无余料建造'},
{value:'AsbObj_RockParts_C_S_01',name:'环境物品: AsbObj_RockParts_C_S_01'},
{value:'AsbObj_SharpRock_A_S_01',name:'环境物品: AsbObj_SharpRock_A_S_01'},
{value:'AsbObj_WhiteWoodRectangle_A_LL_01',name:'环境物品: AsbObj_WhiteWoodRectangle_A_LL_01'},
{value:'Barrel_SkyObj',name:'环境物品: Barrel_SkyObj'},
{value:'DgnObj_BoardIron_E',name:'环境物品: DgnObj_BoardIron_E'},
{value:'DgnObj_SpikeBall_A',name:'环境物品: DgnObj_SpikeBall_A'},
{value:'DgnObj_SpikeBallWood_A',name:'环境物品: DgnObj_SpikeBallWood_A'},
{value:'IceWall_Piece',name:'环境物品: IceWall_Piece'},
{value:'Obj_GerudoHoleCover_A_03',name:'环境物品: Obj_GerudoHoleCover_A_03'},
{value:'Obj_LiftRockWhite_A_01',name:'环境物品: Obj_LiftRockWhite_A_01'},
{value:'Obj_SpikeBall_B',name:'环境物品: Obj_SpikeBall_B'}
];