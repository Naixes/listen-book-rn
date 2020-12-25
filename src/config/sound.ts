import Sound from 'react-native-sound'

Sound.setCategory('Playback')

let sound: Sound

const initPlay = (filePath: string) => {
    return new Promise((resolve, reject) => {
        sound = new Sound(filePath, '', error => {
            if(error) {
                console.log('failed to load sound', error);
                reject(error)
            }else {
                resolve(sound)
            }
        })
    })
}

const play = () => {
    return new Promise((resolve, reject) => {
        if(sound) {
            // 播放完成后才返回
            sound.play((success) => {
                if(success) {
                    resolve(sound)
                }else {
                    reject()
                }
                // 释放资源
                // sound.release()
            })
        }else {
            reject()
        }
    })
}

const pause = () => {
    return new Promise(resolve => {
        if(sound) {
            sound.pause(() => {
                resolve(sound)
            })
        }else {
            resolve(sound)
        }
    })
}

const stop = () => {
    return new Promise(resolve => {
        if(sound) {
            sound.stop(() => {
                resolve(sound)
            })
        }else {
            resolve(sound)
        }
    })
}

const getCurrentTime = () => {
    return new Promise(resolve => {
        if(sound && sound.isLoaded()) {
            sound.getCurrentTime(seconds => resolve(seconds))
        }else {
            resolve(0)
        }
    })
}

const getDuration = () => {
    if(sound) {
        console.log('sound', sound.getDuration());
        return sound.getDuration()
    }
    return 0
}

export {
    initPlay,
    play,
    pause,
    getCurrentTime,
    getDuration,
    stop,
}