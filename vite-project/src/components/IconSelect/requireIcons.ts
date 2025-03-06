/*
* @Author: wqsong2
* @Date: 2025/3/6 16:44
* @Desciption:图标遍历
*/
let icons = []
const modules = import.meta.glob('../../icons/svg/*.svg')
for (const path in modules) {
    const p = path.split('icons/svg/')[1].split('.svg')[0]
    icons.push(p)
}
export default icons