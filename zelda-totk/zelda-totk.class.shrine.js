/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Shrine class) v20230523

	by Marc Robledo 2023
*/

var Shrine={
	countFound:function(){
		var count=0;
		var offsets=SavegameEditor._getOffsetsByHashes(Shrine.HASHES_FOUND);
		for(var i=0; i<Shrine.HASHES_FOUND.length; i++){
			var val=tempFile.readU32(offsets[Shrine.HASHES_FOUND[i]]);
			if(val===0 || val===1)
				count+=val;
			else
				console.error('无效的神庙发现标记值: '+val);
		}
		return count;
	},
	setAllAsFound:function(){
		var count=0;
		var offsets=SavegameEditor._getOffsetsByHashes(Shrine.HASHES_FOUND);
		for(var i=0; i<Shrine.HASHES_FOUND.length; i++){
			var val=tempFile.readU32(offsets[Shrine.HASHES_FOUND[i]]);
			if(val===0){
				tempFile.writeU32(offsets[Shrine.HASHES_FOUND[i]], 1);
				count++;
			}
		}
		MarcDialogs.alert(count+'个神庙被标记为已发现.');
		SavegameEditor.refreshShrineCounters();
		return count;
	},
	countClear:function(){
		var count=0;
		var offsets=SavegameEditor._getOffsetsByHashes(Shrine.HASHES_STATUS);
		for(var i=0; i<Shrine.HASHES_STATUS.length; i++){
			var val=tempFile.readU32(offsets[Shrine.HASHES_STATUS[i]]);
			if(val===0x62965740)
				count++;
			else if(val!==0x04a35d72 && val!==0x7698141c && val!==0x1818ec02 && val!==0x7e731eee)
				console.error('无效的神庙完成标记值: '+val);
		}
		return count;
	},
	setAllAsClear:function(){
		var count=0;
		var offsets=SavegameEditor._getOffsetsByHashes(Shrine.HASHES_STATUS);
		for(var i=0; i<Shrine.HASHES_STATUS.length; i++){
			var val=tempFile.readU32(offsets[Shrine.HASHES_STATUS[i]]);
			if(val!==0x62965740){
				tempFile.writeU32(offsets[Shrine.HASHES_STATUS[i]], 0x62965740);
				count++;
			}
		}
		this.setAllAsFound();
		MarcDialogs.alert(count+'个神庙被标记为已完成.');
		SavegameEditor.refreshShrineCounters();
		return count;
	},

	STATUS_VALUES:{
		0x04a35d72:'Hidden',
		0x7698141c:'Appear',
		0x1818ec02:'Open',
		0x7e731eee:'Enter',
		0x62965740:'Clear'
	},

	HASHES_FOUND:[
		/* surface */
		0xab281eb6,0xda2de4a7,0x4e2394a9,0x3ccbcd89,0xf736a246,0xa091a056,0x39afd018,0x180db7f3,0x39c9d1d4,0x13cc9bd7,0xa540ccd2,0x01dd0595,0xd580cb86,0x67c337b0,0x107d9629,0xe0e3ff58,0x3f03af01,0xb6fc752d,0x4ee4f23f,0x3a35c441,0x724b3238,0x569730c6,0x5e531088,0x7cc25004,0x5dc9e001,0x84d38c3c,0xc139022d,0x2e7c10e5,0x298deca4,0xa70e70d9,0xae9406f6,0x96b9c41d,0xa70ef442,0xec088269,0x29e63d24,0x48d9a29f,0x1070fba4,0x503465a8,0xcbfa18c1,0x821453d0,0xc85630ec,0x9165b447,0x6ef0a41c,0x879a218f,0x5add5c20,0xfa982dbe,0xfb362b82,0x4c436d40,0xb2a10197,0xe3be1265,0xa9ed9e29,0x07044ad8,0xfedda4fc,0xd0fee17c,0x7c21361d,0x771d3ccf,0x39e0db9c,0x5f6180d7,0xa157e40f,0xdf539d50,0x69dfea08,0x5b469590,0x4e6a1638,0xf7353b01,0xaa40992e,0x477a5925,0x4b867efc,0x8db68a3e,0x4d237a04,0x8a25ecfd,0x755e6fb9,0x5ab40b4c,0xd1ece5c8,0x13efa92f,0x838a107b,0x4f7b0efc,0xfdb67136,0x9fd9c53c,0x62a921fa,0xc76dd98f,0x31a1e31a,0xffb918b2,0x7be84fb7,0xd7cf23e7,0xe6483308,0xb9c6e801,0x43d851e9,0x7d7311e9,0x9367ab72,0xfd985cf2,0x09cd13e8,0xe5ac2a19,0xdc08634e,0xffe9a5f0,0x335381c5,0xa9f3ecfb,0xa223778b,0x0503fe33,0x441d05cd,0x16105bfe,0xba365dab,0x0a28eee4,0x392b0114,0xdcb9a2bf,0x224c4765,0x7feca57b,0x03afdbbb,0xa9086479,0x9795be29,0xce206725,0x688d9322,0xe32a554e,0xe82db3c3,0xddba6a33,0x337949fc,0xfd51c2cf,0x8658418d,0x589b2de1,0xeb5995d4,
		/* sky */
		0xa487c021,0x9c9e1c68,0x8b7c26bf,0xd56689f4,0x74932295,0x42659e1a,0xb8f77bba,0x47a34677,0xe8ed3cbc,0xe7624117,0x550c112e,0x87f8cee6,0xef1fab75,0x6ebb8cf7,0x61612bc6,0x64e6ceb6,0x56ba76fc,0x2f6a787e,0x242c6acc,0xc7f643f5,0x34ef0752,0xbf8e91ac,0xe11e7651,0x16096020,0xd00ee7d1,0x8c62ab9f,0x54c7c108,0x4f77d09f,0x021ab370,0x8a7be5a2,0xd8b78288,0xeb0fdc1b,0x70dc6f25
	],
	HASHES_STATUS:[
		/* surface */
		0xaba78c20,0x71f66c0a,0x188708f8,0xdc567b20,0x8b0f3d4e,0x0a71a913,0xbd9c3f11,0x1603e634,0x0897a195,0x50b05884,0x47310fe8,0x5ba580f7,0xdcfddda0,0xb0a1f717,0x19a6c29d,0x2636f89f,0xf583efb8,0x310a78d5,0x2cc8206e,0xcd9c47d9,0xc0001b13,0xa90dfa37,0xc66641dc,0xa1d0b517,0xb3421b7c,0x9f98fdf6,0x0243b01f,0xf8e6d311,0xda4b2bbe,0x3b219b4b,0xd1c47602,0x00e03162,0x23717d79,0x158d9363,0x40111fde,0x80ab4ea1,0xe3f7931d,0xc64d0291,0x75b0ce50,0xb3d4db5c,0x9feb4c99,0x1f210d1c,0x3d7e72eb,0xe5461c22,0x9039c6ac,0x4b6d77ff,0x9ae206d3,0x6e1e89e4,0xe956c974,0xe4a03313,0x4f8c7d71,0x9a92991a,0x0ce573ff,0x5dc2a1cc,0x882a6a8a,0xc3e555ab,0x1fe4e7d7,0x03b85cae,0xeb662ff7,0x635a7fec,0x75a7866a,0x7adf647f,0xf41c214f,0xa19ef491,0x0400707c,0xd01b6667,0x60ddaf28,0xd1851f63,0x1a60a05b,0x6b5651e2,0x9356b9cf,0x0bbf88b9,0xcc216ab8,0x4479d9b4,0x4ce116fc,0x5821879f,0x52ab2c2c,0x559e494f,0x4381d3e3,0x4e1d51cc,0x764f2259,0xc2b95f42,0xb9bc74f4,0xf3e20435,0x62db5348,0xf38397b5,0xcd3d992a,0xbe035f89,0x2131d53e,0x3603e898,0xabe8b158,0x98d0cad4,0xcc69e5e9,0x11c67990,0x2c54c4cd,0x7bd07e53,0xfdc7415b,0x9ff1d245,0xb4a0dafe,0x5ab62997,0x20b07ac7,0x01779d8d,0x0ee473d5,0xcf7c5633,0xd644e361,0xa727f3e7,0x05641932,0x90a2bcd3,0xab6f6cac,0x0cee37a9,0xe8a5ab17,0xec2bccf3,0x8d1db823,0x7869ca50,0x28c279e4,0xeb216531,0x740e2ded,0x7757a518,0x76780513,
		/* sky */
		0x3eb899d5,0xc589e54a,0x61f39b77,0x20f9ea11,0xf4798f96,0x00c44710,0x8def4fd2,0xcac370bc,0x10d6706c,0xf85d93b1,0x46d3a5cf,0xe4e38bc0,0xc2261966,0xa0126c26,0x830c71b5,0x0f9410ba,0xe8882446,0xc3322c01,0x7445c20c,0x4554c022,0xeeb938f5,0x4983cb33,0x8a4f5f90,0xe8d56c4f,0xb9b82618,0x66974794,0x69217c8f,0x22786cb5,0x2f152a5a,0xd1c8656a,0x0b0a7e4e,0x7996beaa,0x4d1ef1f3
	]
};


var Lightroot={
	countFound:function(){
		var count=0;
		var offsets=SavegameEditor._getOffsetsByHashes(Lightroot.HASHES_FOUND);
		for(var i=0; i<Lightroot.HASHES_FOUND.length; i++){
			var val=tempFile.readU32(offsets[Lightroot.HASHES_FOUND[i]]);
			if(val===0 || val===1)
				count+=val;
			else
				console.error('无效的破魔之根发现标记值: '+val);
		}
		return count;
	},
	setAllAsFound:function(){
		var count=0;
		var offsets=SavegameEditor._getOffsetsByHashes(Lightroot.HASHES_FOUND);
		for(var i=0; i<Lightroot.HASHES_FOUND.length; i++){
			var val=tempFile.readU32(offsets[Lightroot.HASHES_FOUND[i]]);
			if(val===0){
				tempFile.writeU32(offsets[Lightroot.HASHES_FOUND[i]], 1);
				count++;
			}
		}
		MarcDialogs.alert(count+'个破魔之根被标记为已发现.');
		SavegameEditor.refreshLightrootCounters();
		return count;
	},
	countClear:function(){
		var count=0;
		var offsets=SavegameEditor._getOffsetsByHashes(Lightroot.HASHES_STATUS);
		for(var i=0; i<Lightroot.HASHES_STATUS.length; i++){
			var val=tempFile.readU32(offsets[Lightroot.HASHES_STATUS[i]]);
			if(val===0x1818ec02)
				count++;
			else if(val!==0x8a88c430)
				console.error('无效的破魔之根激活标记值: '+val);
		}
		return count;
	},
	setAllAsClear:function(){
		var count=0;
		var offsets=SavegameEditor._getOffsetsByHashes(Lightroot.HASHES_STATUS);
		for(var i=0; i<Lightroot.HASHES_STATUS.length; i++){
			var val=tempFile.readU32(offsets[Lightroot.HASHES_STATUS[i]]);
			if(val!==0x1818ec02){
				tempFile.writeU32(offsets[Lightroot.HASHES_STATUS[i]], 0x1818ec02);
				count++;
			}
		}
		this.setAllAsFound();
		MarcDialogs.alert(count+'个破魔之根被激活.');
		SavegameEditor.refreshLightrootCounters();
		return count;
	},

	STATUS_VALUES:{
		0x8a88c430:'Close',
		0x1818ec02:'Open',
	},

	/*HASHES_LOCATION_FOUND:[ //???
		0x0e7aeb1b,0x44f8c5ee,0xe9e39c0a,0x74acd11b,0x3cc2cd3f,0x89a21d18,0xc218ae9e,0x2926ed79,0x725bff6a,0x032b9123,0xda29f470,0x723f746f,0xfb01c1a7,0x641b9634,0x5b3fe625,0x0bd80c6c,0x2ec0d656,0xfc063553,0x8f4f97fa,0xb1b28103,0x5ec74ae8,0xd618386f,0x26b858fa,0xf422d6b7,0x9fc07ec7,0x24872bb3,0x6036408d,0xe49bfb8c,0xba171c26,0xf45335a8,0xb94fcf02,0xb03d548d,0x5b1cf0d3,0xf0d5728a,0x3dddbe98,0x37487d18,0x8793153f,0x3d668881,0x774b40ac,0x4aba4a05,0x788dd669,0x5ff0812b,0x58b2987a,0xca3bdd35,0x25bffb14,0x218857e9,0xe02ec552,0x9e2696bb,0xf5b2e7be,0xc94e54bb,0x6ab75159,0xec04023f,0x9565ace9,0xbf05cf73,0xf8f0ec24,0xfa0cf870,0x770cbe7c,0x2c1cd132,0xc098fb56,0x63219451,0x1605bd79,0xbdc58806,0xb446e1e1,0xacbbb523,0x8f9b8139,0xe17d3aa7,0xee4caeef,0x05eddd99,0x5f18a8d2,0xa0985c87,0xbc1bacd4,0xe3de91f5,0xf0e0d349,0xe3287ae0,0xf9fac1cb,0x7d90a83a,0xa548bf82,0xe3884a76,0xba062b89,0x6ffee3f9,0x17207ca5,0xd050d299,0x0c293091,0xb100339a,0x77671bcf,0x141dc69f,0xd9bd0e35,0x4c31d012,0x96fde534,0x34904a73,0x5a54149f,0x6cc92d32,0x7e611213,0x425f2379,0xc1068384,0xe378b5cb,0xe3edfa09,0x8f786300,0x09af145c,0x6424c778,0x99429cff,0x751c425c,0xed15393e,0x957cce85,0x23b2998b,0x9f378df1,0x170bca6e,0x1e83422a,0xb793e72a,0x6b8970a6,0xd7349109,0x910a4c6b,0x91422099,0x16b93d79,0xdb933d99,0x95b5e34c,0xe02932a4,0x661503c9,0x1ae8f540,0x87784090
	],*/
	HASHES_FOUND:[
		/* depths */
		0xee946811,0x7bce687d,0x8b69cec8,0xe7047303,0x597513c5,0x858d2ac0,0x5b5dfc20,0x8526bec2,0x8f91b33d,0x8233a664,0x67035946,0x88223fe5,0xb32c32c4,0xf3159456,0x17ecb8a2,0xe3e167d7,0x095e8a69,0x363464a8,0x599a3903,0x2b120f63,0x2a63694c,0xf5542404,0x1cb7eefa,0x2dfd5b6d,0x03832844,0x90634724,0x8329ff03,0xeee83601,0xbec33040,0x74b151b7,0xc15b2932,0x3e61c140,0xb4d06edb,0x6f5b6bad,0xb2f2865a,0xa2f31755,0xde268d00,0xd164048f,0xbbcb892e,0x36cbfed5,0x1a4d4c9b,0x052984ec,0x12ce4c4e,0x5b98f982,0xeaafe8c7,0x57b56abb,0x9dea19d8,0x9b06160b,0xbf9a10a2,0x949b655d,0x7332fddd,0x755f89d1,0x322f5f60,0x595521e7,0x4559b3ea,0x86e60d1c,0xf9850baf,0x6228c14c,0x1e879413,0xb13eda28,0x19754dd2,0xdb7d503d,0x2cd6c29b,0x6df0207f,0x51da3fdb,0x9ecde07d,0x453bb9a4,0x883dfe55,0x64ccbf17,0xa97795f2,0x58b1cb6c,0x258a7039,0xc3cc3a88,0x73b842c2,0x8f4d1cc3,0x04726d00,0x597963c3,0x63bdcf90,0x298b16a1,0x4c001ff4,0x6b49c8be,0xa812d7ab,0x122c88ec,0x0f6fca9e,0x699b3fd0,0x27d89912,0xd790a3f3,0x6728886d,0xbd38a8dc,0x5263d4af,0x296492f7,0xa5a1ca6f,0x3d777c0b,0x622a66b6,0xede17222,0x1909c91e,0x079c2dc3,0x961acc33,0x1de99fcb,0x10437217,0x62c0aef5,0xeebc2ef6,0x72844204,0x5d93b985,0x6df73ff1,0xfa0bbe02,0xfe77e85e,0x852ee934,0x6618c85d,0x9f9b6dc5,0x832bbf51,0xa8074bca,0xc301c569,0x721c18d9,0x571f855a,0xc103e463,0x587392b1,0x7f8fec03,0x8f6298c5,0xfbad4e18
	],
	HASHES_STATUS:[
		/* depths */
		0x7983cce0,0x33333cf3,0x6ce18207,0x7501c055,0x9c33c0ee,0x95d2e545,0x530db3b0,0x9bd202cc,0xab0e7ef8,0x723b6d8e,0xeccad937,0x4116fa3e,0xaed0da21,0x0a2fdbc3,0xb31f1425,0xbee71ef6,0x4ac984db,0x86e292a9,0xf8b91db5,0xdb81082f,0xd4c93cc9,0xc7cb0492,0xc61ba8df,0x0bb75174,0x6201c8ac,0xa9a431cb,0xbbc09a60,0x13bc2e90,0xba91b753,0xaf882235,0xc2cd7915,0x9d2db8a6,0x2ec46dd2,0x0a33d50c,0x2793d5bb,0x49392f92,0x84355f56,0xfb2f476e,0xbe46eba7,0xb8d409fd,0xee57ca34,0x232909ae,0xc390c14c,0xabaea27b,0xc6bc55d7,0x4075b322,0x24328c5c,0xa0085daf,0x77799f4a,0x33d16080,0xbbf762e5,0x94086d71,0xfb6e8e6c,0xdac90992,0x006e7a5a,0xf5d75e0a,0x61e2866e,0x7bae4c8e,0xadf9154f,0x31c50a5f,0x140d736b,0xbfdd8d3f,0xb14fc97b,0xc181f676,0xa63867fd,0xa001d192,0x3b45aa8d,0x41fa367a,0xaa8adcf2,0x5ecd7ea3,0xec233a4a,0xb9611cee,0x35efab4e,0x283ee0a6,0x6a7ac761,0x4cf98564,0xb89fb0cd,0xd954340d,0x23695bda,0x6f55e393,0x2ff4ebb3,0x0d5ea2fd,0x6702abaa,0x53507726,0x74950956,0x9c935dcb,0x0d4edad3,0x719e8143,0xf3a643b9,0x5044e2d8,0xed5acc20,0x98dd1df6,0x713eebd5,0x5fa57783,0x530886a7,0x157c9e81,0xd70f9780,0xcf10361e,0x83c3d803,0xde71e3e3,0x6aa3fa2c,0x62c43124,0xc6b1451f,0x6507c376,0x5a3d6726,0x2141d33d,0xd93514dc,0x8e2c31ea,0xa994a428,0x043414d5,0x8d9c0736,0x620231c3,0x32b32061,0xa0e5c6ec,0xa014ed46,0xb54c7930,0x9b9723ae,0x643e2a3f,0xfc5e195a,0x1dd1086a
	]
};