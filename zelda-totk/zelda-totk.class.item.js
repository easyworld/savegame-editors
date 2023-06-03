/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Item class) v20230603

	by Marc Robledo 2023
	item names compiled by Echocolat, Exincracci, HylianLZ and Karlos007
*/

function Item(catId, index, id, quantity, foodEffect, foodEffectHearts, foodEffectMultiplier, foodEffectTime, foodEffectUnknown1){
	this.category=catId;
	this.index=index;
	this.removable=catId!=='arrows';

	this.id=id;
	this.quantity=typeof quantity==='number'? quantity : 1;

	if(catId==='food'){
		this.foodEffect=typeof foodEffect==='number'? foodEffect : Item.FOOD_EFFECTS[0].value;
		this.foodEffectHearts=typeof foodEffectHearts==='number'? foodEffectHearts : 4;
		this.foodEffectMultiplier=typeof foodEffectMultiplier==='number'? foodEffectMultiplier : 0;
		this.foodEffectTime=typeof foodEffectTime==='number'? foodEffectTime : 0;
		this.foodEffectUnknown1=typeof foodEffectUnknown1==='number'? foodEffectUnknown1 : 1;
	}
	Item.buildHtmlElements(this);
}

Item.prototype.getItemTranslation=function(){
	return Item.TRANSLATIONS[this.category][this.id] || this.id;
}
Item.prototype.copy=function(index, newId){
	return new Item(
		this.category,
		index,
		typeof newId==='string'? newId : this.id,
		this.quantity,
		this.category==='food'? this.foodEffect : null,
		this.category==='food'? this.foodEffectHearts : null,
		this.category==='food'? this.foodEffectMultiplier : null,
		this.category==='food'? this.foodEffectTime : null,
		this.category==='food'? this.foodEffectUnknown1 : null
	);
}

Item.prototype.save=function(){
	var categoryHash=capitalizeCategoryId(this.category);
	SavegameEditor.writeString64('Array'+categoryHash+'Ids', this.index, this.id);
	SavegameEditor.writeU32('Array'+categoryHash+'Quantities', this.index, this.quantity);
	if(this.category==='food'){
		SavegameEditor.writeU32('ArrayFoodEffects', this.index, this.foodEffect);
		SavegameEditor.writeU32('ArrayFoodEffectsHearts', this.index, this.foodEffectHearts);
		SavegameEditor.writeU32('ArrayFoodEffectsMultiplier', this.index, this.foodEffectMultiplier);
		SavegameEditor.writeU32('ArrayFoodEffectsTime', this.index, this.foodEffectTime);
		SavegameEditor.writeU32('ArrayFoodEffectsUnknown1', this.index, this.foodEffectUnknown1);
	}
}



Item.buildHtmlElements=function(item){
	//build html elements
	var maxValue=Item.MAXIMUM_QUANTITY[item.id] || 999;
	item._htmlInputQuantity=inputNumber('item-quantity-'+item.category+'-'+item.index, 1, maxValue, item.quantity);
	item._htmlInputQuantity.addEventListener('change', function(){
		var newVal=parseInt(this.value);
		if(!isNaN(newVal) && newVal>0)
			item.quantity=newVal;
	});
	item._htmlInputQuantity.title='数量';


	if(item.category==='food'){
		item._htmlSelectFoodEffect=select('item-food-effects-'+item.category+'-'+item.index, Item.FOOD_EFFECTS, function(){
			item.foodEffect=parseInt(this.value);
		}, item.foodEffect);
		item._htmlSelectFoodEffect.title='料理效果';

		item._htmlInputFoodEffectHearts=inputNumber('item-food-effects-hearts-'+item.category+'-'+item.index, 0, 40*4, item.foodEffectHearts);
		item._htmlInputFoodEffectHearts.addEventListener('change', function(){
			var newVal=parseInt(this.value);
			if(!isNaN(newVal) && newVal>0)
				item.foodEffectHearts=newVal;
		});
		item._htmlInputFoodEffectHearts.title='心心治疗数的1/4';

		item._htmlInputFoodEffectMultiplier=inputNumber('item-food-effects-multiplier-'+item.category+'-'+item.index, 1, 250, item.foodEffectMultiplier);
		item._htmlInputFoodEffectMultiplier.addEventListener('change', function(){
			var newVal=parseInt(this.value);
			if(!isNaN(newVal) && newVal>0)
				item.foodEffectMultiplier=newVal;
		});
		item._htmlInputFoodEffectMultiplier.title='倍率';

		item._htmlInputFoodEffectTime=inputNumber('item-food-effects-time-'+item.category+'-'+item.index, 0, 59999, item.foodEffectTime);
		item._htmlInputFoodEffectTime.addEventListener('change', function(){
			var newVal=parseInt(this.value);
			if(!isNaN(newVal) && newVal>=0)
				item.foodEffectTime=newVal;
		});
		item._htmlInputFoodEffectTime.title='持续时间 (单位：秒)';

		item._htmlSpanFoodEffectUnknownValue=span(item.foodEffectUnknown1);
		item._htmlSpanFoodEffectUnknownValue.title='未知数值';
	}
}

Item.readAll=function(catId){
	var categoryHash=capitalizeCategoryId(catId);
	var itemIds=SavegameEditor.readString64Array('Array'+categoryHash+'Ids');
	var isFood=(catId==='food');
	var validItems=[];
	for(var i=0; i<itemIds.length; i++){
		if(itemIds[i]){
			validItems.push(new Item(
				catId,
				i,
				itemIds[i],
				SavegameEditor.readU32('Array'+categoryHash+'Quantities', i),
				isFood? SavegameEditor.readU32('ArrayFoodEffects', i) : null,
				isFood? SavegameEditor.readU32('ArrayFoodEffectsHearts', i) : null,
				isFood? SavegameEditor.readU32('ArrayFoodEffectsMultiplier', i) : null,
				isFood? SavegameEditor.readU32('ArrayFoodEffectsTime', i) : null,
				isFood? SavegameEditor.readU32('ArrayFoodEffectsUnknown1', i) : null
			));
		}
	}
	return validItems;
}


Item.MAXIMUM_QUANTITY={
Item_Ore_L:999999, //Zonaite
Item_Ore_M:999999, //Large Zonaite
Energy_Material_01:999999, //Crystallized Charge
//Energy_Material_03:999999, //Large Crystallized Charge
//Energy_Material_04:999999, //Huge Crystallized Charge
Obj_WarpDLC:3, //Travel Medallion
MinusRupee_00:999999 //Poe
//MinusRupee_01:999999, //Large Poe
//MinusRupee_02:999999 //Grand Poe
};



Item.FOOD_EFFECTS=[
{name:'无', value:0xb6eede09}, //None
{name:'耐热防护', value:0x1df7a011}, //ResistHot
{name:'火焰防护', value:0x11383afd}, //ResistBurn
{name:'耐寒防护', value:0x9b6d98fb}, //ResistCold
{name:'电麻防护', value:0x183cd822}, //ResistElectric
{name:'雷无效', value:0x25293142}, //ResitLightning
{name:'冻结无效', value:0xf5e2a20c}, //ResistFreeze
//{name:'*ResistAncient', value:0xe53962df},
{name:'游泳速度提升', value:0x67866c6d}, //SwimSpeedUp
{name:'加速游泳精力持久', value:0x87645022}, //DecreaseSwimStamina
//{name:'*SpinAttack', value:0x1e082215},
//{name:'*ClimbWaterfall', value:0x9119b797},
{name:'攀登速度提升', value:0xdc7faf6e}, //ClimbSpeedUp
//{name:'*ClimbSpeedUpOnlyHorizontaly', value:0x81e9dab0},
{name:'攻击力提升', value:0xa9384c6c}, //AttackUp
{name:'低温时冷气攻击', value:0x4a3e58f6}, //AttackUpCold
{name:'高温时火焰攻击', value:0x4c6a85d2}, //AttackUpHot
{name:'雷雨时电流攻击', value:0xff347a38}, //AttackUpThunderstorm
//{name:'*AttackUpDark', value:0xa2d97a77},
//{name:'*AttackUpBone', value:0x51f5ed93},
{name:'安静性提升', value:0x74141898}, //QuietnessUp
{name:'沙上速度提升', value:0x9add92a3}, //SandMoveUp
{name:'雪上速度提升', value:0x33261e44}, //SnowMoveUp
//{name:'*WakeWind', value:0x29e7073a},
//{name:'*TwiceJump', value:0xca81b8ab},
//{name:'*EmergencyAvoid', value:0x8674a913},
{name:'防御提升', value:0xa0a00c0e}, //DefenseUp
{name:'移动力提升', value:0xb3f6b87a}, //AllSpeed
{name:'瘴气防护', value:0x4d1e8af4}, //MiasmaGuard
//{name:'*MaskBokoblin', value:0x6b9c735f},
//{name:'*MaskMoriblin', value:0xcd1c7892},
//{name:'*MaskLizalfos', value:0x18c0a6f1},
//{name:'*MaskLynel', value:0x4d70d744},
//{name:'*YigaDisguise', value:0x2c403cd2},
//{name:'*StalDisguise', value:0x4d91c91b},
//{name:'*LifeRecover', value:0x515632a9},
{name:'MAX心心', value:0xc1db0965}, //LifeMaxUp
{name:'回复精力', value:0xe9a30056}, //StaminaRecover
{name:'MAX精力', value:0x60d8315d}, //ExStaminaMaxUp
{name:'瘴气伤害回复', value:0x03459853}, //LifeRepair
{name:'俯冲机动力提升', value:0x6775f470}, //DivingMobilityUp
{name:'滑落减轻', value:0x2b0cb1e9}, //NotSlippy
//{name:'*Moisturizing', value:0x994b605e},
{name:'发光', value:0x4939dca1}, //LightEmission
{name:'伤害卢比交换', value:0xcfd032db}, //RupeeGuard
//{name:'*FallResist', value:0x8b6e916c},
{name:'大师之剑剑气强化', value:0x59be2cc3}, //SwordBeamUp
//{name:'*VisualizeLife', value:0x5d85e03c},
{name:'夜间移动速度提升', value:0x82638f9d}, //NightMoveSpeedUp
//{name:'*NightGlow', value:0x7d5014ab},
{name:'攀登跳跃精力持久', value:0x0d1d9ef3}, //DecreaseWallJumpStamina
{name:'蓄力攻击精力持久', value:0x48aa5ddf}, //DecreaseChargeAttackStamina
//{name:'*EmitTerror', value:0xe6202c76},
{name:'火焰无效', value:0x2f3b7069}, //NoBurning
{name:'落下伤害无效', value:0xc5def427}, //NoFallDamage
{name:'滑落无效', value:0x346a7abc}, //NoSlip
//{name:'*RupeeGuardRate', value:0x56b27b1f},
//{name:'*MaskAll', value:0xc03cbd09},
{name:'能源持久', value:0xa3b0355e}, //DecreaseZonauEnergy
{name:'能源回复速度提升', value:0x52fad704}, //ZonauEnergyHealUp
//{name:'*MaskHorablin', value:0x719be063},
{name:'瘴气防护提升', value:0x671dbe0d}, //MiasmaDefenseUp
{name:'低温时蓄力攻击强化', value:0xf563b129}, //ChargePowerUpCold
{name:'高温时蓄力攻击强化', value:0x4fb7ed09}, //ChargePowerUpHot
{name:'雷雨时蓄力攻击强化', value:0x8f4fdaf4}, //ChargePowerUpThunderstorm
{name:'光之足迹', value:0x1d249847} //LightFootprint
//{name:'*SoulPowerUpLightning', value:0xfbfc055b},
//{name:'*SoulPowerUpWater', value:0x77b8c024},
//{name:'*SoulPowerUpWind', value:0xc4cf428c},
//{name:'*SoulPowerUpFire', value:0xf149c0c0},
//{name:'*SoulPowerUpSpirit', value:0xf9c555e6},
//{name:'*EnableUseSwordBeam', value:0xaa04e165}
];




Item.fixKeyAvailabilityFlags=function(){
	var changes=0;
	SavegameEditor.currentItems.key.forEach(function(item, i){
		if(Item.AvailabilityFlags[item.id]){
			var offset=SavegameEditor._getOffsetsByHashes([Item.AvailabilityFlags[item.id]], true);
			if(offset){
				var originalValue=tempFile.readU32(offset);
				if(originalValue===0){
					tempFile.writeU32(offset, 1);
					changes++;
				}
			}
		}
	});

	if(changes){
		//console.warn(changes+' paraglider fabric availability flags have been fixed');
		MarcDialogs.alert(changes+'个滑翔伞面料可用性标志已修复');
		if(currentTab==='master' && TOTKMasterEditor.isLoaded()){
			TOTKMasterEditor.refreshResults();
		}
	}
	return changes;
}

Item.AvailabilityFlags={
	/* paraglider fabrics */
	Obj_SubstituteCloth_Default:0x7ff848d1,
	Obj_SubstituteCloth_00:0xb65bc9d7,
	Obj_SubstituteCloth_01:0x41929f49,
	Obj_SubstituteCloth_02:0x084da01f,
	Obj_SubstituteCloth_03:0x31a2d1cc,
	Obj_SubstituteCloth_04:0x865f713d,
	Obj_SubstituteCloth_05:0x30669b55,
	Obj_SubstituteCloth_06:0x022aef11,
	Obj_SubstituteCloth_07:0x112734b9,
	Obj_SubstituteCloth_08:0xdbc821f2,
	Obj_SubstituteCloth_09:0x1ecc8c93,
	Obj_SubstituteCloth_10:0x405203b9,
	Obj_SubstituteCloth_11:0x7c38e018,
	Obj_SubstituteCloth_12:0x0636a9e7,
	Obj_SubstituteCloth_13:0x09865592,
	Obj_SubstituteCloth_14:0x57129d72,
	Obj_SubstituteCloth_15:0xf4035866,
	Obj_SubstituteCloth_16:0xc80d0bf1,
	Obj_SubstituteCloth_17:0x96427113,
	Obj_SubstituteCloth_18:0x8ef713e8,
	Obj_SubstituteCloth_19:0x92754bbd,
	Obj_SubstituteCloth_20:0x94d2472d,
	Obj_SubstituteCloth_21:0xe6cacf83,
	Obj_SubstituteCloth_22:0x85a4e8e3,
	Obj_SubstituteCloth_23:0xca1847dd,
	Obj_SubstituteCloth_24:0x8c007dbc,
	Obj_SubstituteCloth_25:0xa2aec992,
	Obj_SubstituteCloth_26:0x7c552e01,
	Obj_SubstituteCloth_27:0xca76a631,
	Obj_SubstituteCloth_28:0xd9c206b1,
	Obj_SubstituteCloth_29:0x6443f768,
	Obj_SubstituteCloth_30:0x397217b2,
	Obj_SubstituteCloth_31:0x6fb24dcc,
	Obj_SubstituteCloth_32:0x38267d74,
	Obj_SubstituteCloth_33:0xca2baf8b,
	Obj_SubstituteCloth_34:0x500ce8e9,
	Obj_SubstituteCloth_35:0x861db450,
	Obj_SubstituteCloth_36:0x8dbea34c,
	Obj_SubstituteCloth_37:0xd552e642,
	Obj_SubstituteCloth_38:0x6199467d,
	Obj_SubstituteCloth_39:0x6625f898,
	Obj_SubstituteCloth_40:0x63452b97,
	Obj_SubstituteCloth_41:0x53e2da50,
	Obj_SubstituteCloth_43:0xee3f78e3,
	Obj_SubstituteCloth_45:0xf2d50ecf,
	Obj_SubstituteCloth_46:0xa4bf8025,
	Obj_SubstituteCloth_48:0x0f1e166d,
	Obj_SubstituteCloth_49:0xc9ab8463,
	Obj_SubstituteCloth_51:0x21170251,
	Obj_SubstituteCloth_52:0xeaae73a3,
	Obj_SubstituteCloth_53:0xa5ecfeec,
	Obj_SubstituteCloth_55:0x93e7260f,
	Obj_SubstituteCloth_56:0x6688319b
}




Item.TRANSLATIONS={
'arrows':{
NormalArrow:'箭'
},

'materials':{
Item_Fruit_A:'苹果',
Item_Fruit_B:'草莓',
Item_Fruit_C:'酥麻水果',
Item_Fruit_E:'速速莲蓬',
Item_Fruit_F:'冰冷蜜瓜',
Item_Fruit_G:'椰子',
Item_Fruit_H:'大剑香蕉',
Item_Fruit_I:'暖暖草果',
Item_Fruit_J:'铠甲南瓜',
Item_Fruit_K:'橡子',
Item_Fruit_L:'小鸟的树果',
Item_Fruit_M:'海拉鲁番茄',
Item_Fruit_N:'向阳南瓜',
Item_Fruit_P:'金苹果',

Item_Mushroom_A:'精力蘑菇',
Item_Mushroom_B:'冰冷蘑菇',
Item_Mushroom_C:'暖暖蘑菇',
Item_Mushroom_E:'海拉鲁蘑菇',
Item_Mushroom_F:'生命松露',
Item_Mushroom_H:'酥麻蘑菇',
Item_Mushroom_J:'潜行蘑菇',
Item_Mushroom_L:'大剑蘑菇',
Item_Mushroom_M:'铠甲蘑菇',
Item_Mushroom_N:'大生命松露',
Item_Mushroom_O:'毅力蘑菇',
Item_Mushroom_P:'天空蘑菇',
Item_MushroomGet_D:'速速蘑菇',
Item_MushroomGet_K:'光亮蘑菇',

Animal_Insect_A:'速速青蛙',
Animal_Insect_AA:'精力独角仙',
Animal_Insect_AB:'耐火凤蝶',
Animal_Insect_AG:'贴贴青蛙',
Animal_Insect_AH:'贴贴蜥蜴',
Animal_Insect_AI:'暗萤火虫',
Animal_Insect_B:'毅力青蛙',
Animal_Insect_C:'冰冷蜻蜓',
Animal_Insect_E:'静静萤火虫',
Animal_Insect_F:'妖精',
Animal_Insect_G:'大剑独角仙',
Animal_Insect_H:'精力蚱蜢',
Animal_Insect_I:'酥麻蜻蜓',
Animal_Insect_M:'生命蜥蜴',
Animal_Insect_N:'冰冷凤蝶',
Animal_Insect_P:'铠甲独角仙',
Animal_Insect_Q:'暖暖凤蝶',
Animal_Insect_R:'酥麻凤蝶',
Animal_Insect_S:'速速蜥蜴',
Animal_Insect_T:'暖暖蜻蜓',
Animal_Insect_X:'耐火蜥蜴',

Item_InsectGet_K:'大剑螃蟹',
Item_InsectGet_O:'铠甲螃蟹',
Item_InsectGet_Z:'精力螃蟹',

BombFruit:'炸弹花',
ConfusionFruit:'混乱花',
ElectricalFruit:'电流果',
FireFruit:'火焰果',
IceFruit:'冷气果',
LightFruit:'闪耀果',
SmokeFruit:'烟雾蘑菇',
WaterFruit:'水之果',

Item_Enemy_01:'波克布林的牙齿',
Item_Enemy_02:'波克布林的肝脏',
Item_Enemy_04:'蜥蜴战士的爪子',
Item_Enemy_05:'蜥蜴战士的尾巴',
Item_Enemy_07:'莫力布林的牙齿',
Item_Enemy_08:'莫力布林的肝脏',
Item_Enemy_13:'莱尼尔的蹄子',
Item_Enemy_14:'莱尼尔的肝脏',
Item_Enemy_15:'红色丘丘胶',
Item_Enemy_16:'黄色丘丘胶',
Item_Enemy_17:'白色丘丘胶',
Item_Enemy_18:'蝙蝠的翅膀',
Item_Enemy_19:'蝙蝠的眼珠',
Item_Enemy_20:'八爪怪的脚',
Item_Enemy_21:'八爪怪的眼珠',
Item_Enemy_24:'莫尔德拉吉克的背鳍',
Item_Enemy_25:'莫尔德拉吉克的肝脏',
Item_Enemy_32:'西诺克斯的指甲',
Item_Enemy_33:'西诺克斯的牙齿',
Item_Enemy_34:'西诺克斯的肝脏',
Item_Enemy_38:'奥尔龙的鳞片',
Item_Enemy_39:'奥尔龙的爪子',
Item_Enemy_40:'丘丘胶',
Item_Enemy_41:'喷火蜥蜴战士的尾巴',
Item_Enemy_42:'吐雹蜥蜴战士的尾巴',
Item_Enemy_43:'电麻蜥蜴战士的尾巴',
Item_Enemy_44:'火蝙蝠的翅膀',
Item_Enemy_45:'电蝙蝠的翅膀',
Item_Enemy_46:'冰蝙蝠的翅膀',
Item_Enemy_47:'奥尔龙的牙齿碎片',
Item_Enemy_49:'聂尔龙的鳞片',
Item_Enemy_50:'聂尔龙的爪子',
Item_Enemy_51:'聂尔龙的牙齿碎片',
Item_Enemy_53:'费罗龙的鳞片',
Item_Enemy_54:'费罗龙的爪子',
Item_Enemy_55:'费罗龙的牙齿碎片',
Item_Enemy_57:'八爪怪气球',
Item_Enemy_58:'喷火蜥蜴战士的犄角',
Item_Enemy_59:'吐雹蜥蜴战士的犄角',
Item_Enemy_60:'电麻蜥蜴战士的犄角',
Item_Enemy_64:'首领波克布林的犄角',
Item_Enemy_66:'卡库达的眼珠',
Item_Enemy_67:'队长魔像的角',
Item_Enemy_69:'吉波得之骨',
Item_Enemy_77:'波克布林的犄角',
Item_Enemy_78:'蓝色波克布林的犄角',
Item_Enemy_79:'黑色波克布林的犄角',
Item_Enemy_80:'白银波克布林的犄角',
Item_Enemy_89:'莫力布林的犄角',
Item_Enemy_90:'蓝色莫力布林的犄角',
Item_Enemy_91:'黑色莫力布林的犄角',
Item_Enemy_92:'白银莫力布林的犄角',
Item_Enemy_100:'霍拉布林的犄角',
Item_Enemy_101:'蓝色霍拉布林的犄角',
Item_Enemy_102:'黑色霍拉布林的犄角',
Item_Enemy_103:'白银霍拉布林的犄角',
Item_Enemy_104:'霍拉布林的爪子',
Item_Enemy_105:'霍拉布林的肝脏',
Item_Enemy_106:'蜥蜴战士的犄角',
Item_Enemy_107:'蓝色蜥蜴战士的犄角',
Item_Enemy_108:'黑色蜥蜴战士的犄角',
Item_Enemy_109:'白银蜥蜴战士的犄角',
Item_Enemy_114:'蓝色蜥蜴战士的尾巴',
Item_Enemy_115:'黑色蜥蜴战士的尾巴',
Item_Enemy_116:'白银蜥蜴战士的尾巴',
Item_Enemy_117:'火蝙蝠的眼珠',
Item_Enemy_118:'电蝙蝠的眼珠',
Item_Enemy_119:'冰蝙蝠的眼珠',
Item_Enemy_121:'吉波得的肝脏',
Item_Enemy_123:'吉波得的翅膀',
Item_Enemy_124:'卡库达的翅膀',
Item_Enemy_130:'左纳乌能源',
Item_Enemy_131:'大的左纳乌能源',
Item_Enemy_132:'蓝色首领波克布林的犄角',
Item_Enemy_133:'黑色首领波克布林的犄角',
Item_Enemy_134:'白银首领波克布林的犄角',
Item_Enemy_135:'首领波克布林的牙齿',
Item_Enemy_136:'首领波克布林的肝脏',
Item_Enemy_142:'西诺克斯的犄角',
Item_Enemy_143:'蓝色西诺克斯的犄角',
Item_Enemy_144:'黑色西诺克斯的犄角',
Item_Enemy_148:'莱尼尔的刃角',
Item_Enemy_149:'蓝鬃莱尼尔的刃角',
Item_Enemy_150:'白鬃莱尼尔的刃角',
Item_Enemy_151:'白银莱尼尔的刃角',
Item_Enemy_153:'古栗欧克的火焰犄角',
Item_Enemy_154:'古栗欧克的冰雪犄角',
Item_Enemy_155:'古栗欧克的雷电犄角',
Item_Enemy_156:'古栗欧克的翅膀',
Item_Enemy_157:'古栗欧克的肝脏',
Item_Enemy_158:'白龙的鳞片',
Item_Enemy_159:'白龙的爪子',
Item_Enemy_160:'白龙的牙齿碎片',
Item_Enemy_166:'兵队魔像的角',
Item_Enemy_167:'兵队魔像的角（中等）',
Item_Enemy_168:'兵队魔像的角（上等）',
Item_Enemy_169:'兵队魔像的角（特等）',
Item_Enemy_181:'莱克莱克的胃石',
Item_Enemy_182:'火焰莱克的胃石',
Item_Enemy_183:'电击莱克的胃石',
Item_Enemy_184:'冰雪莱克的胃石',
Item_Enemy_186:'巨霸迦马的大牙',
Item_Enemy_187:'黑曜巨霸迦马的大牙',
Item_Enemy_188:'白苍巨霸迦马的大牙',
Item_Enemy_189:'巨霸迦马的爪子',
Item_Enemy_190:'巨霸迦马的肝脏',
Item_Enemy_191:'队长魔像的角（中等）',
Item_Enemy_192:'队长魔像的角（上等）',
Item_Enemy_193:'队长魔像的角（特等）',
Item_Enemy_208:'骷髅西诺克斯的犄角',
Item_Enemy_210:'莫尔德拉吉克的颚骨',
Item_Enemy_211:'奥尔龙的犄角',
Item_Enemy_212:'聂尔龙的犄角',
Item_Enemy_213:'费罗龙的犄角',
Item_Enemy_214:'白龙的犄角',
Item_Enemy_215:'莱尼尔的碎角',
Item_Enemy_216:'蓝鬃莱尼尔的碎角',
Item_Enemy_217:'白鬃莱尼尔的碎角',
Item_Enemy_218:'白银莱尼尔的碎角',
Item_Enemy_228:'奥尔龙的龙岩石',
Item_Enemy_229:'聂尔龙的龙岩石',
Item_Enemy_230:'费罗龙的龙岩石',
Item_Enemy_231:'白龙的龙岩石',

Item_Enemy_137:'岩石巨人的心岩', //fusable only
Item_Enemy_138:'夜光石岩石巨人的心岩', //fusable only
Item_Enemy_139:'稀有石岩石巨人的心岩', //fusable only
Item_Enemy_140:'熔岩巨人的心岩', //fusable only
Item_Enemy_141:'冰岩巨人的心岩', //fusable only
Item_Enemy_220:'急冻盖拉的大颚', //fusable only
Item_Enemy_221:'巨砾哥马的岩脚', //fusable only
Item_Enemy_223:'吉波得女王的巨大翅膀', //fusable only
Item_Enemy_225:'方块魔像的核心', //fusable only
Item_Enemy_226:'中等方块魔像的核心', //fusable only
Item_Enemy_227:'上等方块魔像的核心', //fusable only

Item_FishGet_A:'海拉鲁鲈鱼',
Item_FishGet_AA:'远昔骨舌鱼',
Item_FishGet_AC:'光亮霍拉鱼',
Item_FishGet_B:'生命鲈鱼',
Item_FishGet_C:'冰冷鳟鱼',
Item_FishGet_D:'酥麻鳟鱼',
Item_FishGet_E:'大剑鲤鱼',
Item_FishGet_F:'大剑鲷鱼',
Item_FishGet_G:'铠甲鲷鱼',
Item_FishGet_H:'铠甲鲤鱼',
Item_FishGet_I:'生命鲑鱼',
Item_FishGet_J:'暖暖鳟鱼',
//Item_FishGet_K:"Hearty Blueshell Snail",
Item_FishGet_L:'精力鲈鱼',
Item_FishGet_M:'潜行田螺',
Item_FishGet_X:'潜行鳟鱼',
Item_FishGet_Z:'三色鲤鱼',

Item_Material_01:'蔗糖',
Item_Material_02:'鼓隆的调味粉',
Item_Material_03:'海拉鲁米',
Item_Material_04:'禽蛋',
Item_Material_05:'鲜奶',
Item_Material_06:'山羊黄油',
Item_Material_07:'塔邦挞小麦',
Item_Material_08:'怪物精华',
Item_Material_09:'油壶',
Item_Material_10:'哈特诺起司',
Item_Material_11:'暗之块',

Item_Ore_A:'钻石',
Item_Ore_B:'红宝石',
Item_Ore_C:'蓝宝石',
Item_Ore_D:'黄玉',
Item_Ore_E:'蛋白石',
Item_Ore_F:'琥珀',
Item_Ore_G:'夜光石',
Item_Ore_H:'岩盐',
Item_Ore_I:'打火石',
Item_Ore_J:'星星碎片',
Item_Ore_L:'左纳尼乌姆',
Item_Ore_M:'大的左纳尼乌姆',

Item_PlantGet_A:'海拉鲁草',
Item_PlantGet_B:'生命小萝卜',
Item_PlantGet_C:'生命大萝卜',
Item_PlantGet_E:'冰冷香草',
Item_PlantGet_F:'暖暖香草',
Item_PlantGet_G:'大剑草',
Item_PlantGet_H:'铠甲草',
Item_PlantGet_I:'潜行草',
Item_PlantGet_J:'宁静公主',
Item_PlantGet_L:'酥麻香草',
Item_PlantGet_M:'速速胡萝卜',
Item_PlantGet_O:'速速紫罗兰',
Item_PlantGet_Q:'毅力胡萝卜',
Item_PlantGet_R:'向阳草',
Item_PlantGet_S:'精力草',
Item_PlantGet_U:'克洛格的叶子',


Item_Meat_01:'兽肉',
Item_Meat_02:'高级兽肉',
Item_Meat_06:'禽肉',
Item_Meat_07:'高级禽肉',
Item_Meat_11:'顶级兽肉',
Item_Meat_12:'顶级禽肉',

LightBall_Small:'光亮花的种子',
LightBall_Large:'巨大光亮花的种子',

BeeHome:'精力蜂的蜂蜜',
FldObj_Pinecone_A_01:'海拉鲁球果',
Item_KingScale:'王的鳞片',
Item_Weapon_01:'古代之刃',
Obj_FireWoodBundle:'木柴捆'
},

'food':{
Item_Boiled_01:'水煮蛋',

Item_ChilledFish_01:'冰冻鲈鱼',
Item_ChilledFish_02:'冰冻生命鲑鱼',
Item_ChilledFish_03:'冰冻鳟鱼',
Item_ChilledFish_04:'冰冻鲤鱼',
Item_ChilledFish_05:'冰冻鲷鱼',
Item_ChilledFish_06:'冰冻生命鲈鱼',
Item_ChilledFish_07:'冰冻螃蟹',
Item_ChilledFish_08:'冰冻田螺',
//Item_ChilledFish_09:"Icy Hearty Blueshell Snail",
Item_ChilledFish_16:'冰冻骨舌鱼',
Item_ChilledFish_18:'冰冻霍拉鱼',

Item_Chilled_01:'冰冻兽肉',
Item_Chilled_02:'高级冰冻兽肉',
Item_Chilled_03:'顶级冰冻兽肉',
Item_Chilled_04:'冰冻禽肉',
Item_Chilled_05:'高级冰冻禽肉',
Item_Chilled_06:'顶级冰冻禽肉',

Item_RoastFish_01:'烤鲈鱼',
Item_RoastFish_02:'烤生命鲈鱼',
Item_RoastFish_03:'烤鳟鱼',
Item_RoastFish_04:'烤生命鲑鱼',
Item_RoastFish_07:'烤鲤鱼',
Item_RoastFish_09:'烤鲷鱼',
//Item_RoastFish_11:"Blueshell Escargot",
Item_RoastFish_13:'烤潜行田螺',
Item_RoastFish_15:'烤螃蟹',
Item_RoastFish_16:'烤骨舌鱼',
Item_RoastFish_18:'烤霍拉鱼',

Item_Roast_01:'烤兽肉',
Item_Roast_02:'烤禽肉',
Item_Roast_03:'烤苹果',
Item_Roast_04:'烤精力蘑菇',
Item_Roast_05:'烤生命松露',
Item_Roast_06:'烤海拉鲁蘑菇',
Item_Roast_07:'烤草莓',
Item_Roast_08:'烤酥麻水果',
//Item_Roast_09:"Roasted Hearty Durian",
Item_Roast_10:'烤椰子',
Item_Roast_11:'烤大剑香蕉',
Item_Roast_12:'烤冰冷蜜瓜',
Item_Roast_13:'烤暖暖草果',
Item_Roast_15:'烤铠甲南瓜',
Item_Roast_16:'烤速速莲蓬',
Item_Roast_18:'烤小萝卜',
Item_Roast_19:'烤大萝卜',
Item_Roast_24:'烤速速胡萝卜',
Item_Roast_27:'烤大剑草',
Item_Roast_28:'烤铠甲草',
Item_Roast_31:'烤冰冷蘑菇',
Item_Roast_32:'烤暖暖蘑菇',
Item_Roast_33:'烤酥麻蘑菇',
Item_Roast_36:'烤速速蘑菇',
Item_Roast_37:'烤大剑蘑菇',
Item_Roast_38:'烤铠甲蘑菇',
Item_Roast_39:'烤潜行蘑菇',
Item_Roast_40:'烤高级兽肉',
Item_Roast_41:'烤高级禽肉',
Item_Roast_45:'烤顶级兽肉',
Item_Roast_46:'烤顶级禽肉',
Item_Roast_48:'烤橡子',
Item_Roast_49:'烤大生命松露',
Item_Roast_50:'烤毅力胡萝卜',
Item_Roast_51:'烤蛋',
Item_Roast_52:'烤树果',
Item_Roast_53:'烤毅力蘑菇',
Item_Roast_54:'烤海拉鲁番茄',
Item_Roast_55:'烤向阳南瓜',
Item_Roast_56:'烤天空蘑菇',
Item_Roast_58:'烤光亮蘑菇',
Item_Roast_59:'烤金苹果',



Item_Cook_A_01:'烤蘑菇串',
Item_Cook_A_02:'蒸蘑菇',
Item_Cook_A_03:'蒸水果',
Item_Cook_A_04:'蒸鱼',
Item_Cook_A_05:'蒸肉',
Item_Cook_A_07:'水果拌蘑菇',
Item_Cook_A_08:'烤鱼蘑菇串',
Item_Cook_A_09:'烤肉蘑菇串',
Item_Cook_A_10:'煎蛋卷',
Item_Cook_A_11:'甘露炖蘑菇',
Item_Cook_A_12:'甘露炖肉',
Item_Cook_A_13:'甘露炖鱼',
Item_Cook_A_14:'甘露炖蔬菜',
Item_Cook_B_01:'炒野菜',
Item_Cook_B_02:'炖水果',
Item_Cook_B_05:'烤鱼',
Item_Cook_B_06:'烤肉串',
Item_Cook_B_11:'大份炒野菜',
Item_Cook_B_12:'大份炖水果',
Item_Cook_B_13:'大份烤蘑菇串',
Item_Cook_B_15:'大份烤鱼',
Item_Cook_B_16:'大份烤肉串',
Item_Cook_B_17:'海陆煎烤',
Item_Cook_B_18:'高级海陆煎烤',
Item_Cook_B_19:'顶级海陆煎烤',
Item_Cook_B_20:'南瓜酿肉',
Item_Cook_B_21:'炒暖暖草果',
Item_Cook_B_22:'炒坚果',
Item_Cook_B_23:'串烤海鲜',
Item_Cook_C_16:'妖精回力水',
Item_Cook_C_17:'药',
Item_Cook_D_01:'盐烤蘑菇',
Item_Cook_D_02:'盐烤野菜',
Item_Cook_D_03:'盐烤鱼',
Item_Cook_D_04:'岩盐烤肉',
Item_Cook_D_05:'高级岩盐烤肉',
Item_Cook_D_06:'顶级岩盐烤肉',
Item_Cook_D_07:'香辣煎肉',
Item_Cook_D_08:'香辣煎鱼',
Item_Cook_D_09:'岩盐烤蟹',
Item_Cook_D_10:'炒螃蟹',
Item_Cook_E_01:'禽肉菜饭',
Item_Cook_E_02:'高级禽肉菜饭',
Item_Cook_E_03:'顶级禽肉菜饭',
Item_Cook_E_04:'煎蛋饭',
Item_Cook_F_01:'鲜肉牛奶汤',
Item_Cook_F_02:'海鲜牛奶汤',
Item_Cook_F_03:'蔬菜浓汤',
Item_Cook_F_04:'心心牛奶汤',
Item_Cook_G_02:'海鲜饭团',
Item_Cook_G_03:'野菜饭团',
Item_Cook_G_04:'蘑菇饭团',
Item_Cook_G_05:'兽肉盖饭',
Item_Cook_G_06:'高级兽肉盖饭',
Item_Cook_G_09:'顶级兽肉盖饭',
Item_Cook_G_10:'海鲜炒饭',
Item_Cook_G_11:'咖喱菜饭',
Item_Cook_G_12:'蘑菇烩饭',
Item_Cook_G_13:'蔬菜烩饭',
Item_Cook_G_14:'鲑鱼烩饭',
Item_Cook_G_15:'鲜肉饭团',
Item_Cook_G_16:'蟹肉蛋炒饭',
Item_Cook_G_17:'蟹肉烩饭',
Item_Cook_H_01:'干煎鱼',
Item_Cook_H_02:'干煎鲷鱼',
Item_Cook_H_03:'干煎鲑鱼',
Item_Cook_I_01:'水果派',
Item_Cook_I_02:'苹果派',
Item_Cook_I_03:'蛋挞',
Item_Cook_I_04:'鲜肉派',
Item_Cook_I_05:'胡萝卜蛋糕',
Item_Cook_I_06:'南瓜蛋糕',
Item_Cook_I_07:'黄油苹果',
Item_Cook_I_08:'蜂蜜苹果',
Item_Cook_I_09:'蜂蜜水果',
Item_Cook_I_10:'原味可丽饼',
Item_Cook_I_11:'草莓可丽饼',
Item_Cook_I_12:'坚果蛋糕',
Item_Cook_I_13:'炸香蕉',
Item_Cook_I_14:'鲜蛋布丁',
Item_Cook_I_15:'鱼肉派',
Item_Cook_I_16:'蜂蜜糖',
Item_Cook_I_17:'蜂蜜可丽饼',
Item_Cook_J_01:'咖喱饭',
Item_Cook_J_02:'蔬菜咖喱饭',
Item_Cook_J_03:'海鲜咖喱饭',
Item_Cook_J_04:'禽肉咖喱饭',
Item_Cook_J_05:'高级禽肉咖喱饭',
Item_Cook_J_06:'兽肉咖喱饭',
Item_Cook_J_07:'高级兽肉咖喱饭',
Item_Cook_J_08:'顶级禽肉咖喱饭',
Item_Cook_J_09:'顶级兽肉咖喱饭',
Item_Cook_K_01:'炖肉',
Item_Cook_K_02:'高级炖肉',
Item_Cook_K_03:'南瓜炖菜',
Item_Cook_K_04:'贝肉杂烩',
Item_Cook_K_05:'顶级炖肉',
Item_Cook_K_06:'蘑菇牛奶汤',
Item_Cook_K_07:'蔬菜牛奶汤',
Item_Cook_K_08:'胡萝卜炖菜',
Item_Cook_K_09:'热牛奶',
Item_Cook_L_01:'炖怪物',
Item_Cook_L_02:'怪物汤',
Item_Cook_L_03:'怪物蛋糕',
Item_Cook_L_04:'怪物饭团',
Item_Cook_L_05:'怪物咖喱饭',
Item_Cook_M_01:'小麦面包',
Item_Cook_N_01:'海鲜杂烩饭',
Item_Cook_N_02:'水果蛋糕',
Item_Cook_N_03:'蔬菜煎蛋卷',
Item_Cook_N_04:'蘑菇煎蛋卷',
Item_Cook_O_01:'奇异的菜肴',
Item_Cook_O_02:'过硬的菜肴',
Item_Cook_P_01:'炒香蘑菇',
Item_Cook_P_02:'炒香草',
Item_Cook_P_03:'烤兽肉串',
Item_Cook_P_04:'高级烤兽肉串',
Item_Cook_P_05:'顶级烤兽肉串',

Item_Cook_Q_01:'炖番茄',
Item_Cook_Q_02:'番茄汤',
Item_Cook_Q_03:'蒸野菜番茄',
Item_Cook_Q_04:'炖蘑菇番茄',
Item_Cook_Q_05:'海鲜番茄汤',
Item_Cook_Q_06:'原烧',
Item_Cook_Q_07:'炒黄油',
Item_Cook_Q_08:'啪啦啪啦炒饭',
Item_Cook_Q_09:'起司蛋糕',
Item_Cook_Q_10:'起司烩饭',
Item_Cook_R_01:'起司煎蛋卷',
Item_Cook_R_02:'野菜牛奶粥',
Item_Cook_R_02:'野菜牛奶粥',
Item_Cook_R_04:'番茄披萨',
Item_Cook_R_05:'油炖海鲜',
Item_Cook_R_06:'油炸禽肉',
Item_Cook_R_07:'油炸高级禽肉',
Item_Cook_R_08:'油炸顶级禽肉',
Item_Cook_R_09:'黏糊糊起司面包',
Item_Cook_R_10:'鲜鱼起司焗烤',
Item_Cook_S_01:'起司咖喱',
Item_Cook_S_02:'起司兽肉盖饭',
Item_Cook_S_03:'起司高级兽肉盖饭',
Item_Cook_S_04:'起司顶级兽肉盖饭',
Item_Cook_S_05:'魔人炖煮',
Item_Cook_S_06:'魔人饭团',
Item_Cook_S_07:'魔人汤',
Item_Cook_S_08:'魔人咖喱饭',
Item_Cook_S_09:'魔人蛋糕',
Item_Cook_S_10:'起司番茄'
},

'devices':{
SpObj_EnergyBank_Capsule_A_01:'备用电池',
SpObj_EnergyBank_Capsule_A_02:'大容量电池',
SpObj_CookSet_Capsule_A_01:'便携锅',
SpObj_Beamos_Capsule_A_01:'光线头',
SpObj_FlameThrower_Capsule_A_01:'火龙头',
SpObj_SnowMachine_Capsule_A_01:'冰龙头',
SpObj_ElectricBoxGenerator_Capsule_A_01:'雷龙头',
SpObj_BalloonEnvelope_Capsule_A_01:'热气球',
SpObj_Cannon_Capsule_A_01:'大炮',
SpObj_Cart_Capsule_A_01:'平台车',
SpObj_Chaser_Capsule_A_01:'追踪平台车',
SpObj_ControlStick_Capsule_A_01:'操纵杆',
SpObj_GolemHead_Capsule_A_01:'魔像的头部',
SpObj_WindGenerator_Capsule_A_01:'风扇机',
SpObj_FloatingStone_Capsule_A_01:'浮游石',
SpObj_LiftableWaterPump_Capsule_A_01:'放水栓',
SpObj_FlashLight_Capsule_A_01:'灯',
SpObj_LightMirror_Capsule_A_01:'镜子',
SpObj_Rocket_Capsule_A_01:'火箭',
SpObj_SlipBoard_Capsule_A_01:'滑橇',
SpObj_SpringPiston_Capsule_A_01:'弹簧',
SpObj_TiltingDoll_Capsule_A_01:'不倒翁',
SpObj_Pile_Capsule_A_01:'桩',
SpObj_FastWheel_Capsule_A_01:'小轮胎',
SpObj_FastWheel_Capsule_B_01:'大轮胎',
SpObj_LiftGeneratorWing_Capsule_A_01:'翼',
SpObj_TimerBomb_Capsule_A_01:'计时炸弹'
},

'key':{
Obj_DRStone_Get:'普尔亚平板',
Parasail:'滑翔帆',
Obj_DungeonClearSeal:'祝福之光',
Obj_Battery_Get:'电池',
Obj_KorokNuts:'克洛格的果实',
Obj_ProofKorok:'伯库林的果实',
CaveMasterMedal:'魔犹伊的遗失物',
Energy_Material_01:'左纳乌能源结晶',
//Energy_Material_03:"Large Crystallized Charge",
//Energy_Material_04:"Huge Crystallized Charge",
MinusRupee_00:'魄',
//MinusRupee_01:"Large Poe",
//MinusRupee_02:"Grand Poe",
Obj_SageWill:'贤者的遗志',
Obj_StableHostlePointCard:'驿站点数卡',

Obj_DefeatHonor_00:'讨伐岩石巨人勋章',
Obj_DefeatHonor_01:'讨伐西诺克斯勋章',
Obj_DefeatHonor_02:'讨伐莫尔德拉吉克勋章',
Obj_DefeatHonor_03:'讨伐巨霸迦马勋章',
Obj_DefeatHonor_04:'讨伐方块魔像勋章',
Obj_DefeatHonor_05:'讨伐古栗欧克勋章',

Obj_SageSoul_Gerudo:'和雷之贤者露珠的盟约',
Obj_SageSoul_Goron:'和火之贤者阿沅的盟约',
Obj_SageSoul_Rito:'和风之贤者丘栗的盟约',
Obj_SageSoul_Zonau:'和魂之贤者米涅鲁的盟约',
Obj_SageSoul_Zora:'和水之贤者希多的盟约',
Obj_SageSoulPlus_Gerudo:'和雷之贤者露珠的牢固盟约',
Obj_SageSoulPlus_Goron:'和火之贤者阿沅的牢固盟约',
Obj_SageSoulPlus_Rito:'和风之贤者丘栗的牢固盟约',
Obj_SageSoulPlus_Zonau:'和魂之贤者米涅鲁的牢固盟约',
Obj_SageSoulPlus_Zora:'和水之贤者希多的牢固盟约',

GameRomHorseReins_00:"驿站协会缰绳",
GameRomHorseReins_01:'旅人缰绳',
GameRomHorseReins_02:'王族缰绳',
GameRomHorseReins_03:'骑士缰绳',
GameRomHorseReins_04:'怪物缰绳',
GameRomHorseReins_05:'奢华缰绳',
GameRomHorseSaddle_00:"驿站协会马鞍",
GameRomHorseSaddle_01:'旅人马鞍',
GameRomHorseSaddle_02:'王族马鞍',
GameRomHorseSaddle_03:'骑士马鞍',
GameRomHorseSaddle_04:'怪物马鞍',
GameRomHorseSaddle_05:'奢华马鞍',
GameRomHorseSaddle_07:'牵引挽具',

Obj_Camera:'照相机',
Obj_WarpDLC:'传送标记器',
//Obj_WarpDLC_Prototype:"Travel Medallion",
Obj_AutoBuilder:'蓝图',
Obj_AutoBuilderDraft_00:'设计图石板',
Obj_Tooreroof:'通天术',
Obj_TreasureMap_00:'残旧的地图',
Item_StableHostelAccommodationCoupon_A:'驿站住宿券',
Obj_AutoBuilder:'蓝图',
Obj_AutoBuilderDraft_00:'设计图石板',
Obj_AutoBuilderDraftAssassin_00:'依盖队设计图',
Obj_CaveWellHonor_00:'周游列井的纪念品',
Obj_CheckPointHonor_00:'通过黑暗的证明',
Obj_EnergyUtuwa_A_01:'附加电池',
Obj_HiddenScroll_00:'土遁之书',

/*Obj_Battery_Get_Capacity03:"Energy Cell[03]",
Obj_Battery_Get_Capacity04:"Energy Cell[04]",
Obj_Battery_Get_Capacity05:"Energy Cell[05]",
Obj_Battery_Get_Capacity06:"Energy Cell[06]",
Obj_Battery_Get_Capacity07:"Energy Cell[07]",
Obj_Battery_Get_Capacity08:"Energy Cell[08]",
Obj_Battery_Get_Capacity09:"Energy Cell[09]",
Obj_Battery_Get_Capacity10:"Energy Cell[10]",
Obj_Battery_Get_Capacity11:"Energy Cell[11]",
Obj_Battery_Get_Capacity12:"Energy Cell[12]",
Obj_Battery_Get_Capacity13:"Energy Cell[13]",
Obj_Battery_Get_Capacity14:"Energy Cell[14]",
Obj_Battery_Get_Capacity15:"Energy Cell[15]",
Obj_Battery_Get_Capacity16:"Energy Cell[16]",
Obj_Battery_Get_Capacity17:"Energy Cell[17]",
Obj_Battery_Get_Capacity18:"Energy Cell[18]",
Obj_Battery_Get_Capacity19:"Energy Cell[19]",
Obj_Battery_Get_Capacity20:"Energy Cell[20]",
Obj_Battery_Get_Capacity21:"Energy Cell[21]",
Obj_Battery_Get_Capacity22:"Energy Cell[22]",
Obj_Battery_Get_Capacity23:"Energy Cell[23]",
Obj_Battery_Get_Capacity24:"Energy Cell[24]",
Obj_Battery_Get_Capacity25:"Energy Cell[25]",
Obj_Battery_Get_Capacity26:"Energy Cell[26]",
Obj_Battery_Get_Capacity27:"Energy Cell[27]",
Obj_Battery_Get_Capacity28:"Energy Cell[28]",
Obj_Battery_Get_Capacity29:"Energy Cell[29]",
Obj_Battery_Get_Capacity30:"Energy Cell[30]",
Obj_Battery_Get_Capacity31:"Energy Cell[31]",
Obj_Battery_Get_Capacity32:"Energy Cell[32]",
Obj_Battery_Get_Capacity33:"Energy Cell[33]",
Obj_Battery_Get_Capacity34:"Energy Cell[34]",
Obj_Battery_Get_Capacity35:"Energy Cell[35]",
Obj_Battery_Get_Capacity36:"Energy Cell[36]",
Obj_Battery_Get_Capacity37:"Energy Cell[37]",
Obj_Battery_Get_Capacity38:"Energy Cell[38]",
Obj_Battery_Get_Capacity39:"Energy Cell[39]",
Obj_Battery_Get_Capacity40:"Energy Cell[40]",
Obj_Battery_Get_Capacity41:"Energy Cell[41]",
Obj_Battery_Get_Capacity42:"Energy Cell[42]",
Obj_Battery_Get_Capacity43:"Energy Cell[43]",
Obj_Battery_Get_Capacity44:"Energy Cell[44]",
Obj_Battery_Get_Capacity45:"Energy Cell[45]",
Obj_Battery_Get_Capacity46:"Energy Cell[46]",
Obj_Battery_Get_Capacity47:"Energy Cell[47]",
Obj_Battery_Get_Capacity48:"Energy Cell[48]",*/

Obj_SubstituteCloth_Default:"普通的布料",
Obj_SubstituteCloth_00:"鼓隆族的布料",
Obj_SubstituteCloth_01:"卓拉族的布料",
Obj_SubstituteCloth_02:"格鲁德族的布料",
Obj_SubstituteCloth_03:"海拉鲁王族的布料",
Obj_SubstituteCloth_04:"左纳乌的布料",
Obj_SubstituteCloth_05:"希卡族的布料",
Obj_SubstituteCloth_06:"依盖队的布料",
Obj_SubstituteCloth_07:"讨伐队的布料",
Obj_SubstituteCloth_08:"左纳乌调查队的布料",
Obj_SubstituteCloth_09:"马神大人的布料",
Obj_SubstituteCloth_10:"沃托里村的布料",
Obj_SubstituteCloth_11:"白诘报社的布料",
Obj_SubstituteCloth_12:"松达建筑店的布料",
Obj_SubstituteCloth_13:"柯尔天亲手制作的布料",
Obj_SubstituteCloth_14:"克洛格族的布料",
Obj_SubstituteCloth_15:"帝灰熊的布料",
Obj_SubstituteCloth_16:"洛贝利亲手制作的布料",
Obj_SubstituteCloth_17:"SAGONO的布料",
Obj_SubstituteCloth_18:"卡库达的布料",
Obj_SubstituteCloth_19:"奥尔汀鸵鸟的布料",
Obj_SubstituteCloth_20:"咕咕鸡的布料",
Obj_SubstituteCloth_21:"马的布料",
Obj_SubstituteCloth_22:"丘丘的布料",
Obj_SubstituteCloth_23:"莱尼尔的布料",
Obj_SubstituteCloth_24:"古栗欧克的布料",
Obj_SubstituteCloth_25:"骷髅西诺克斯的布料",
Obj_SubstituteCloth_26:"回忆服的布料",
Obj_SubstituteCloth_27:"海利亚兜帽的布料",
Obj_SubstituteCloth_28:"海拉鲁公主的布料",
Obj_SubstituteCloth_29:"鼓隆英杰的布料",
Obj_SubstituteCloth_30:"利特英杰的布料",
Obj_SubstituteCloth_31:"卓拉英杰的布料",
Obj_SubstituteCloth_32:"格鲁德英杰的布料",
Obj_SubstituteCloth_33:"古代希卡花纹的布料",
Obj_SubstituteCloth_34:"波克布林的布料",
Obj_SubstituteCloth_35:"魔王的布料",
Obj_SubstituteCloth_36:"赤狮子王的布料",
Obj_SubstituteCloth_37:"希克的布料",
Obj_SubstituteCloth_38:"阴影之镜的布料",
Obj_SubstituteCloth_39:"黄昏公主的布料",
Obj_SubstituteCloth_40:"荣蓉牧场的布料",
Obj_SubstituteCloth_41:"魔吉拉的面具的布料",
Obj_SubstituteCloth_43:"灭亡王族的布料",
Obj_SubstituteCloth_45:"剑之精灵的布料",
Obj_SubstituteCloth_46:"点阵的布料",
Obj_SubstituteCloth_48:"蛋图案的布料",
Obj_SubstituteCloth_49:"女神的布料",
Obj_SubstituteCloth_51:"新式·英杰服的布料",
Obj_SubstituteCloth_52:"塞尔达公主的布料",
Obj_SubstituteCloth_53:"格鲁德王的布料",
Obj_SubstituteCloth_55:"熟悉图案的布料",
Obj_SubstituteCloth_56:"卡邦达亲手制作的布料"
}
};



/*
CookEffect0 (BOTW)
===========
0xbf800000	0x00000000 (none, only hearts?)
0x40000000	0x41000000 (two yellow hearts?)
0x41600000	0x43c80000 (1/3 stamina)
0x41600000	0x43480000 (1/4 stamina)
0x41500000	0x3f800000 (speed up)
0x41800000	0x3f800000 (fire)
0x40a00000	0x3f800000 (ice)
0x40c00000	0x3f800000 (electric)
0x41200000	0x3f800000 (strength)
0x41300000	0x3f800000 (defense)
0x41400000	0x3f800000 (stealth)
*/