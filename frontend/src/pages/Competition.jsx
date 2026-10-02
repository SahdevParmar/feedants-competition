import MyCard from "@/components/MyCard";
import api from "@/api/client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import AuthDialog from "@/components/AuthDialog";

const Competition = () => {
  const [allCompetitions, setAllCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/competitions");
        setAllCompetitions(res.data.competitions);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!allCompetitions) return <div className="p-6 text-red-600">Competition not found</div>;

  return (
    <div>
      <Header onLoginClick={() => setAuthOpen(true)} />

      <div className="md:px-30 px-4 items-center justify-center py-8 grid md:grid-cols-2 grid-cols-1 gap-4">
        {allCompetitions.map((competition) => (
          <MyCard competition={competition} key={competition._id} />
        ))}
      </div>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default Competition;