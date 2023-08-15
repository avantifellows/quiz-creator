import Button from "@/components/Buttons/Button";
import DataDisplay from "@/components/displayTable/DataDisplay";
// import { Inter } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
// const inter = Inter({ subsets: ["latin"] });

// TODO: Fetch data from the server using axios
const data = [
  {
    studentData: {
      program: {
        value: "Himachal Students",
        label: "Himachal Students",
      },
      batch: {
        value: "DL-11-Alpha-eng-23",
        label: "DL-11-Alpha-eng-23",
      },
      grade: {
        value: "10",
        label: "10",
      },
      course: {
        value: "Alpha",
        label: "Alpha",
      },
      stream: {
        value: "Medical",
        label: "Medical",
      },
    },
    testData: {
      testType: {
        value: "homework",
        label: "Homework",
      },
      testFormat: {
        value: "major_test",
        label: "Major Test",
      },
      testPurpose: {
        value: "weekly_test",
        label: "Weekly Test",
      },
      testPlatform: {
        value: "Quiz",
        label: "Quiz",
      },
      markingScheme: {
        value: "neet",
        label: "NEET",
      },
      optionalLimit: {
        value: "4,-1",
        label: "4 , -1",
      },
    },
    timelineData: {
      isEnabled: {
        value: true,
        label: "ON",
      },
      sessionType: {
        value: "infinite",
        label: "Infinite",
      },
      synced: {
        value: false,
        label: "FALSE",
      },
    },
  },
  {
    studentData: {
      program: {
        value: "Himachal Students",
        label: "Himachal Students",
      },
      batch: {
        value: "DL-11-Alpha-eng-23",
        label: "DL-11-Alpha-eng-23",
      },
      grade: {
        value: "10",
        label: "10",
      },
      course: {
        value: "Alpha",
        label: "Alpha",
      },
      stream: {
        value: "Medical",
        label: "Medical",
      },
    },
    testData: {
      testType: {
        value: "homework",
        label: "Homework",
      },
      testFormat: {
        value: "major_test",
        label: "Major Test",
      },
      testPurpose: {
        value: "weekly_test",
        label: "Weekly Test",
      },
      testPlatform: {
        value: "Quiz",
        label: "Quiz",
      },
      markingScheme: {
        value: "neet",
        label: "NEET",
      },
      optionalLimit: {
        value: "4,-1",
        label: "4 , -1",
      },
    },
    timelineData: {
      isEnabled: {
        value: true,
        label: "ON",
      },
      sessionType: {
        value: "infinite",
        label: "Infinite",
      },
      synced: {
        value: false,
        label: "FALSE",
      },
    },
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Quiz-creator</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <nav className="flex justify-between m-2 p-5">
        <div className="bg-[#B52326] text-white text-[10px] px-2 md:px-3 rounded-lg md:text-lg">
          <Button
            text="+ Create Quiz Session"
            onClick={() => router.push("/SessionCreator")}
          />
        </div>

        <input
          type="text"
          placeholder="Search by CMS_id or Test_name"
          className="rounded-md border-black border-solid border text-xs md:text-md md:px-4 md:w-1/5"
        />
      </nav>

      <DataDisplay data={data} />
    </>
  );
}
