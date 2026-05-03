import { registerRoot, Composition } from 'remotion';
import { DashboardAd } from './DashboardAdV2';
import { FusionCreativeShootDay } from './FusionCreativeShootDay';
import { InstagramBeforeAfter } from './InstagramBeforeAfter';
import { SmokedSmashedMenu } from './SmokedSmashedMenu';
import { SmokedSmashedMenuWide } from './SmokedSmashedMenuWide';
import { ARMenuPromo } from './ARMenuPromo';

function Root() {
  return (
    <>
      <Composition
        id="ARMenuPromo"
        component={ARMenuPromo}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ARMenuPromoSquare"
        component={ARMenuPromo}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="DashboardAd"
        component={DashboardAd}
        durationInFrames={1650}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FusionCreativeShootDay"
        component={FusionCreativeShootDay}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="InstagramBeforeAfter"
        component={InstagramBeforeAfter}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SmokedSmashedMenu"
        component={SmokedSmashedMenu}
        durationInFrames={1210}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SmokedSmashedMenuWide"
        component={SmokedSmashedMenuWide}
        durationInFrames={1210}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
}

registerRoot(Root);
