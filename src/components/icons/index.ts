'use client';

import type { UpgradeId, ScheduleActivityId, CosmeticProcedureId } from '@/types/game';
import { IconPrTeam, IconDataAnalysis, IconNetwork, IconLegal } from './UpgradeIcons';
import { IconFilming, IconVariety, IconEndorsement, IconRest, IconTraining } from './ScheduleIcons';
import {
  IconSkincare, IconInjection, IconNoseFiller, IconJawBotox,
  IconDoubleEyelid, IconNoseJob, IconFacialContour,
} from './CosmeticIcons';

export { IconWeiboCompose } from './CosmeticIcons';
export { IconMessages, IconArtist, IconWorkspace, IconMe } from './TabIcons';
export { IconOverview, IconFansite, IconInsurance } from './SectionIcons';
export { fansiteIconMap } from './FansiteIcons';
export { insuranceIconMap } from './InsuranceIcons';
export { artistAvatarMap } from './ArtistAvatars';

type AnyIcon = (props: { size?: number }) => React.JSX.Element;

export const upgradeIconMap: Record<UpgradeId, AnyIcon> = {
  pr_team: IconPrTeam,
  data_analysis: IconDataAnalysis,
  network: IconNetwork,
  legal: IconLegal,
};

export const scheduleIconMap: Record<ScheduleActivityId, AnyIcon> = {
  filming: IconFilming,
  variety: IconVariety,
  endorsement: IconEndorsement,
  rest: IconRest,
  training: IconTraining,
};

export const cosmeticIconMap: Record<CosmeticProcedureId, AnyIcon> = {
  skincare_facial: IconSkincare,
  micro_injection: IconInjection,
  nose_filler: IconNoseFiller,
  jaw_botox: IconJawBotox,
  double_eyelid: IconDoubleEyelid,
  nose_job: IconNoseJob,
  facial_contour: IconFacialContour,
};
