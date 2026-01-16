import Image from "next/image";
import Link from "next/link";
interface Props {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}
const EventCard = ({ image, title, slug, location, date, time }: Props) => {
  return (
    <>
      <Link href={`/events/${slug}`} id="event-card">
        <Image
          src={image}
          width={410}
          height={300}
          alt={title}
          className="poster"
        />

        <div className="flex flex-row gap-2">
          <Image
            src={"/icons/pin.svg"}
            height={14}
            width={14}
            alt="icon-location"
          />
          <p>{location}</p>
        </div>

        <div className="datetime">
          <div>
            <Image
              alt="calender"
              src={"/icons/calendar.svg"}
              height={14}
              width={14}
            />
            <p>{date}</p>
          </div>
          <div>
            <Image
              alt="clock"
              src={"/icons/clock.svg"}
              height={14}
              width={14}
            />
            <p>{time}</p>
          </div>
        </div>
        <p className="title">{title}</p>
      </Link>
    </>
  );
};

export default EventCard;
