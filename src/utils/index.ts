

let container = new Map()
const CreateFormConfig = {
    /** 存储值 */
    bind: (data: any) => {
        container.set('config', data)
    },
    /** 返回值 */
    use: () => {
        return container.get('config')
    }
}

export {
    CreateFormConfig
}