import Realm from 'realm'

// 表结构
export interface IPlayer {
    id: string;
    title: string;
    thumbnailUrl: string;
    currentTime: number;
    duration: number;
    rate: number;
}
// 声明表

const Player = {
    name: 'Player',
    primaryKey: 'id',
    properties: {
        id: 'string',
        title: 'string',
        thumbnailUrl: 'string',
        currentTime: {type: 'double', default: 0},
        duration: {type: 'double', default: 0},
    }
}
// 以下会导致闪退
// @ haul-bundler / babel-preset-react-native，不会将“类”编译为“功能”，因此Realm可能不会使用‘new’实例化‘setting’
// class Player {
//     duration = 0
//     currentTime = 0
//     static schema = {
//         name: 'Player',
//         primaryKey: 'id',
//         properties: {
//             id: 'string',
//             title: 'string',
//             thumbnailUrl: 'string',
//             currentTime: {type: 'double', default: 0},
//             duration: {type: 'double', default: 0},
//         }
//     }

//     get rate() {
//         return this.duration > 0 ? Math.floor((this.currentTime * 100 / this.duration) * 100) / 100 : 0
//     }
// }

// 更新表结构，指定版本号，从0开始；如有数据指定数据迁移函数
// const realm = new Realm({schema: [Player], schemaVersion: 1, migration: (oldRealm, newRealm) => {
//     if(oldRealm.schemaVersion < 1) {
//         // ...
//     }
// }})
const realm = new Realm({schema: [Player]})

// 保存数据
export function savePlayer(data: Partial<IPlayer>) {
    try {
        realm.write(() => {
            realm.create('Player', data)
        })
    } catch (error) {
        console.log('save error', error);
    }
}

export default realm