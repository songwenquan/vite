/*
 * @Author: wqsong2
 * @Date: 2023/10/13 17:22
 * @Desciption:字典值处理
 */
import { getCurrentInstance } from 'vue';
export default {
	state: {},
	getters: {
		// 返回对应字典值
		dictGetter: (state: string) => {
			return state;
		},
	},
	actions: {
		// 多字典查询接口
		getDicList({ commit }: { state: any; commit: any }, typeCodeStr: any) {
			if (typeCodeStr) {
				const key = typeCodeStr.url;
				const { proxy } = getCurrentInstance() as any; // this
				const typeCodes = typeCodeStr.type.split(',');
				proxy.$api.auth[key]({ dataType: typeCodeStr }).then((config: any) => {
					if (config.flag) {
						typeCodeStr === 'ALL'
							? Object.keys(config.data).forEach((key) => {
									commit('SET_TYPE_CODE', {
										dataType: key,
										data: config.data[key],
									});
								})
							: typeCodes.forEach((item: any) => {
									commit('SET_TYPE_CODE', {
										dataType: item,
										data: config.data[item],
									});
								});
					}
				});
			}
		},
		// 单字典遍历查询
		getDicListStr({ state, commit }: { state: any; commit: any }, typeCodeStr: any) {
			if (typeCodeStr) {
				const key = typeCodeStr.url;
				const { proxy } = getCurrentInstance() as any; // this
				const typeCodes = typeCodeStr.type.split(',');
				typeCodes.forEach((dataType: any) => {
					if (!state[dataType].length) {
						// 加载过的字典不再重新获取（刷新除外）
						proxy.$api.auth[key]({ pinYinType: dataType }).then((config: any) => {
							if (config.flag) {
								commit('SET_TYPE_CODEStr', {
									dataType: dataType,
									data: config.data,
								});
							}
						});
					}
				});
			}
		},
		// url方式字典查询
		getDicListUrl({ state, commit }: { state: any; commit: any }, typeCodeStr: any) {
			if (typeCodeStr) {
				const { proxy } = getCurrentInstance() as any; // this
				const typeCodes = typeCodeStr.type.split(',');
				typeCodes.forEach((dataType: any) => {
					state[dataType] = state[dataType] ? state[dataType] : [];
					if (!state[dataType].length) {
						// 加载过的字典不再重新获取（刷新除外）
						proxy.$api.auth['distData'](dataType).then((config: any) => {
							if (config.code == '200') {
								commit('SET_TYPE_CODEUrl', {
									dataType: dataType,
									data: config.data,
								});
							}
						});
					}
				});
			}
		},
		getDicListUrl2({ state, commit }: { state: any; commit: any }, typeCodeStr: any) {
			if (typeCodeStr) {
				const { proxy } = getCurrentInstance() as any; // this
				const typeCodes = typeCodeStr.type.split(',');
				typeCodes.forEach((dataType: any) => {
					state[dataType] = state[dataType] ? state[dataType] : [];
					if (!state[dataType].length) {
						// 加载过的字典不再重新获取（刷新除外）
						proxy.$api.auth['getType'](dataType).then((config: any) => {
							if (config.code == '200') {
								commit('SET_TYPE_CODEUrl', {
									dataType: dataType,
									data: config.data,
								});
							}
						});
					}
				});
			}
		},
	},
	mutations: {
		SET_TYPE_CODE(state: any, info: any) {
			state[info.dataType] = [];
			state[info.dataType] = info.data.map((a: any) => {
				return {
					label: a.dataName || a.typeName,
					value: a.dataCode || a.typeCode,
					id: a.dataCode || a.typeCode,
				};
			});
		},
		SET_TYPE_CODEStr(state: any, info: any) {
			state[info.dataType] = [];
			state[info.dataType] = info.data.map((a: any) => {
				return {
					label: a.label || a.mc,
					value: a.value || a.dm,
					id: a.value || a.dm,
				};
			});
		},
		SET_TYPE_CODEUrl(state: any, info: any) {
			state[info.dataType] = [];
			state[info.dataType] = info.data.map((a: any) => {
				return {
					label: a.label || a.dictLabel || a.dictName,
					value: a.value || a.dictValue || a.dictType,
					elTagType: a.listClass,
					elTagClass: a.cssClass,
					...a,
				};
			});
		},
	},
};
