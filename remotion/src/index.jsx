import { registerRoot, Composition } from 'remotion';
import { DashboardAd } from './DashboardAdV2';
import { FusionCreativeShootDay } from './FusionCreativeShootDay';
import { InstagramBeforeAfter } from './InstagramBeforeAfter';

function Root() {
  return (
    <>
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
    </>
  );
}

registerRoot(Root);
