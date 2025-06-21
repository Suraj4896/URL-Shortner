import DeviceStats from "@/components/DeviceStats";
import Location from "@/components/Location";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlState } from "@/context";
import { getClicksForUrl } from "../../db/apiClicks";
import { deleteUrl, getUrl } from "../../db/apiUrls";
import useFetch from "../hooks/useFetch";
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";

const LinkPage = () => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const navigate = useNavigate();
  const { user } = UrlState();
  const { id } = useParams();
  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, { id, user_id: user?.id });

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  if (error) {
    navigate("/dashboard");
  }

  let link = url?.custom_url || url?.short_url || "";

  return (
    <div className="min-h-screen w-full px-4 sm:px-8 py-6 ml-24">
      {(loading || loadingStats) && <BarLoader className="mb-4" width="100%" color="#36d7b7" />}
      <div className="grid grid-cols-1 lg:grid-cols-2 items-start">
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary break-words">
            {url?.title}
          </h1>

          <a
            href={`${window.location.host}/${link}`}
            target="_blank"
            className="text-blue-400 hover:underline break-all text-xl sm:text-2xl font-semibold"
          >
            {`${window.location.host}/${link}`}
          </a>

          <a
            href={url?.original_url}
            target="_blank"
            className="flex items-center gap-2 text-muted-foreground hover:underline break-all"
          >
            <LinkIcon className="w-4 h-4" />
            {url?.original_url}
          </a>

          <span className="text-sm text-muted-foreground">
            Created At: {new Date(url?.created_at).toLocaleString()}
          </span>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(`${window.location.host}/${link}`)}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={downloadImage}>
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              onClick={() => fnDelete().then(() => navigate("/dashboard"))}
              disabled={loadingDelete}
            >
              {loadingDelete ? <BeatLoader size={6} color="white" /> : <Trash className="w-4 h-4" />}
            </Button>
          </div>

          <img
            src={url?.qr}
            alt="QR Code"
            className="w-full sm:max-w-xs rounded-md ring-2 ring-blue-500 p-2 object-contain"
          />
        </div>

        <Card className="mt-2 bg-background">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Analytics</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 ">
            {stats && stats.length ? (
              <>
                <Card className="bg-[#102343]">
                  <CardHeader>
                    <CardTitle className="text-xl">Total Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold">{stats.length}</p>
                  </CardContent>
                </Card>

                <div>
                  <CardTitle className="text-lg mb-1">Location Data</CardTitle>
                  <Location stats={stats} />
                </div>

                <div>
                  <CardTitle className="text-lg mb-1">Device Info</CardTitle>
                  <DeviceStats stats={stats} />
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">
                {loadingStats === false ? "No Statistics yet" : "Loading Statistics..."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LinkPage;