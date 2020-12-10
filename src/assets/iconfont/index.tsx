/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { GProps } from 'react-native-svg';
import IconLoading from './IconLoading';
import IconVolumeUp from './IconVolumeUp';
import IconFavoritesFill from './IconFavoritesFill';
import IconVolumeOff from './IconVolumeOff';
import IconPause from './IconPause';
import IconPlayArrow from './IconPlayArrow';
import IconFullscreen from './IconFullscreen';
import IconLijitingke from './IconLijitingke';
import IconBofang3 from './IconBofang3';
import IconPaste from './IconPaste';
import IconShangyishou from './IconShangyishou';
import IconXiayishou from './IconXiayishou';
import IconDown from './IconDown';
import IconBack from './IconBack';
import IconHuanyipi from './IconHuanyipi';
import IconXihuan from './IconXihuan';
import IconMore from './IconMore';
import IconShengyin from './IconShengyin';
import IconV from './IconV';
import IconUser from './IconUser';
import IconBofang from './IconBofang';
import IconPlay2 from './IconPlay2';
import IconTime from './IconTime';
import IconMessage from './IconMessage';
import IconBofang1 from './IconBofang1';
import IconBofang2 from './IconBofang2';
import IconFaxian from './IconFaxian';
import IconShijian from './IconShijian';
import IconShouye from './IconShouye';
import IconShoucang from './IconShoucang';

export type IconNames = 'icon-loading' | 'icon-volume-up' | 'icon-favorites-fill' | 'icon-volume-off' | 'icon-pause' | 'icon-play-arrow' | 'icon-fullscreen' | 'icon-lijitingke' | 'icon-bofang3' | 'icon-paste' | 'icon-shangyishou' | 'icon-xiayishou' | 'icon-down' | 'icon-back' | 'icon-huanyipi' | 'icon-xihuan' | 'icon-more' | 'icon-shengyin' | 'icon-V' | 'icon-user' | 'icon-bofang' | 'icon-play2' | 'icon-time' | 'icon-message' | 'icon-bofang1' | 'icon-bofang2' | 'icon-faxian' | 'icon-shijian' | 'icon-shouye' | 'icon-shoucang';

interface Props extends GProps, ViewProps {
  name: IconNames;
  size?: number;
  color?: string | string[];
}

let IconFont: FunctionComponent<Props> = ({ name, ...rest }) => {
  switch (name) {
    case 'icon-loading':
      return <IconLoading key="1" {...rest} />;
    case 'icon-volume-up':
      return <IconVolumeUp key="2" {...rest} />;
    case 'icon-favorites-fill':
      return <IconFavoritesFill key="3" {...rest} />;
    case 'icon-volume-off':
      return <IconVolumeOff key="4" {...rest} />;
    case 'icon-pause':
      return <IconPause key="5" {...rest} />;
    case 'icon-play-arrow':
      return <IconPlayArrow key="6" {...rest} />;
    case 'icon-fullscreen':
      return <IconFullscreen key="7" {...rest} />;
    case 'icon-lijitingke':
      return <IconLijitingke key="8" {...rest} />;
    case 'icon-bofang3':
      return <IconBofang3 key="9" {...rest} />;
    case 'icon-paste':
      return <IconPaste key="10" {...rest} />;
    case 'icon-shangyishou':
      return <IconShangyishou key="11" {...rest} />;
    case 'icon-xiayishou':
      return <IconXiayishou key="12" {...rest} />;
    case 'icon-down':
      return <IconDown key="13" {...rest} />;
    case 'icon-back':
      return <IconBack key="14" {...rest} />;
    case 'icon-huanyipi':
      return <IconHuanyipi key="15" {...rest} />;
    case 'icon-xihuan':
      return <IconXihuan key="16" {...rest} />;
    case 'icon-more':
      return <IconMore key="17" {...rest} />;
    case 'icon-shengyin':
      return <IconShengyin key="18" {...rest} />;
    case 'icon-V':
      return <IconV key="19" {...rest} />;
    case 'icon-user':
      return <IconUser key="20" {...rest} />;
    case 'icon-bofang':
      return <IconBofang key="21" {...rest} />;
    case 'icon-play2':
      return <IconPlay2 key="22" {...rest} />;
    case 'icon-time':
      return <IconTime key="23" {...rest} />;
    case 'icon-message':
      return <IconMessage key="24" {...rest} />;
    case 'icon-bofang1':
      return <IconBofang1 key="25" {...rest} />;
    case 'icon-bofang2':
      return <IconBofang2 key="26" {...rest} />;
    case 'icon-faxian':
      return <IconFaxian key="27" {...rest} />;
    case 'icon-shijian':
      return <IconShijian key="28" {...rest} />;
    case 'icon-shouye':
      return <IconShouye key="29" {...rest} />;
    case 'icon-shoucang':
      return <IconShoucang key="30" {...rest} />;
  }

  return null;
};

IconFont = React.memo ? React.memo(IconFont) : IconFont;

export default IconFont;
