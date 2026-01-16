import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { events } from "@/lib/constant";
const page = () => {
  return (
    <>
      <section>
        <h1 className="text-center">
          Only Platform for all the Dev Events
          <br />
          Event You don't Miss...
        </h1>
        <p className="text-center mt-5 text-gray-400">
          Hackathons,Meetups,Conferences.All at One-place
        </p>
      </section>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events.map((e) => (
            <EventCard key={e.title} {...e} />
          ))}
        </ul>
      </div>
    </>
  );
};

export default page;
