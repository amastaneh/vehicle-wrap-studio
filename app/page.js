import { discoverAssets } from "./api/assets/route";
import WrapStudioClient from "./WrapStudioClient";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const { models, wraps } = discoverAssets();
  return <WrapStudioClient initialModels={models} initialWraps={wraps} />;
}
