import { ReactElement } from 'react';
import { Grid } from './grid/Grid';
import { Callout } from './callout/Callout';
import { BulletList } from './bulletList/bulletList';
import { HiddenBlock } from './hiddenBlock/hiddenBlock';

export const CUSTOM_COMPONENTS: { [key: string]: (props: {}) => ReactElement } = {
	"call": Callout,
	"grid": Grid,
	"list": BulletList
};