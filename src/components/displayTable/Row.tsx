import React, { useCallback, useState } from "react";
import NextLink from "next/link";
import { Check, Copy, Edit, Link, Trash } from "react-feather";
import { DbTypes } from "@/types/ResponseTypes";
import { useRouter } from "next/router";
import { formatTime } from "@/utils/TimeFormatter";

const TableRow = ({
  row,
  index,
  currentPage,
  itemsPerPage,
  isExpanded,
  toggleExpand,
}: {
  row: DbTypes;
  index: number;
  currentPage: number;
  itemsPerPage: number;
  isExpanded: boolean;
  toggleExpand: () => void;
}) => {
  const {
    meta_data,
    start_time,
    end_time,
    repeat_schedule: repeatSchedule,
    name,
    id,
  } = row!;

  const {
    batch,
    date_created: dateCreated,
    test_format: format,
    test_purpose: purpose,
    optional_limits: optionalLimit,
    test_type: type,
    test_takers_count: testTakers,
    report_link: reportLink,
    infinite_session: sessionType,
    has_synced_to_bq: synced,
    enabled: isEnabled,
    shortened_link: shortenedLink,
    admin_testing_link: adminTestingLink,
  } = meta_data || {};

  const hasNoId = !id;
  const hasNoreportlink = !reportLink;
  const hasNoportallink = !shortenedLink;
  const hasNoadmintestinglink = !adminTestingLink;
  const router = useRouter();

  const startTime = formatTime(start_time!);
  const endTime = formatTime(end_time!);

  const startDate = new Date(start_time!).toLocaleDateString();
  const endDate = new Date(end_time!).toLocaleDateString();

  const actualIndex = currentPage * itemsPerPage + index + 1;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const copyToClipboard = useCallback(async (link: string) => {
    await navigator.clipboard.writeText(link);
    alert("Link Copied");
    // setIsModalVisible(true);
    // setTimeout(() => setIsModalVisible(false), 250);
  }, []);

  return (
    <>
      <tr
        className={`${
          hasNoreportlink && `text-gray-400`
        } hover:bg-gray-50 border-none text-center`}
        onClick={() => toggleExpand()}
      >
        <td className="border-b border-black p-2">{actualIndex}</td>
        <td className="border-b border-black p-2">{batch}</td>
        <td className="border-b border-black p-2">{name}</td>
        <td suppressHydrationWarning className="border-b border-black p-2">
          {startDate}
        </td>
        <td suppressHydrationWarning className="border-b border-black p-2">
          {endDate}
        </td>
        <td className="border-b border-black p-2">{testTakers}</td>
        <td className="border-b border-black p-2">
          {typeof reportLink === "string" && !hasNoId && !hasNoreportlink && (
            <NextLink href={reportLink} target="_blank">
              <Link
                className="mx-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  copyToClipboard(reportLink);
                }}
              />
            </NextLink>
          )}
        </td>
        <td className="border-b border-black p-2">
          {typeof shortenedLink === "string" &&
            !hasNoId &&
            !hasNoportallink && (
              <NextLink href={shortenedLink} target="_blank">
                <Link
                  className="mx-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    copyToClipboard(shortenedLink);
                  }}
                />
              </NextLink>
            )}
        </td>
        <td className="border-b border-black p-2">
          {typeof adminTestingLink === "string" &&
            !hasNoId &&
            !hasNoadmintestinglink && (
              <NextLink href={adminTestingLink} target="_blank">
                <Link className="mx-auto" />
              </NextLink>
            )}
        </td>
        <td className="border-b border-black flex justify-evenly p-2">
          <div title="Duplicate">
            <Copy
              className="cursor-pointer"
              onClick={(e) => {
                router.push(`/Session?type=duplicate&sessionId=${id}`);
                e.stopPropagation();
              }}
            />
          </div>

          <div title="Edit">
            <Edit
              className="cursor-pointer"
              onClick={(e) => {
                router.push(`/Session?type=edit&sessionId=${id}`);
                e.stopPropagation();
              }}
            />
          </div>
          <div title="Delete">
        <Trash
          className="cursor-pointer"
          onClick={(e) => {
            // Implement the delete functionality here
            // For example, calling an API to delete the item
            e.stopPropagation();
          }}
        />
      </div>
        </td>
      </tr>

      {/* Collapsible Container */}
      {isExpanded && (
        <tr className="bg-slate-100 text-[#3F3F3F]">
          <td colSpan={10}>
            <table style={{ width: "100%" }}>
              <tbody className="border-[#b52326] border-l-4 border-r-4">
                <tr>
                  <td>Test type: {type}</td>
                  <td>Test Takers Count: {testTakers}</td>
                  <td>Date Created: {dateCreated}</td>
                  <td>Infinite Session: {sessionType}</td>
                </tr>
                <tr>
                  <td>Test Format: {format}</td>
                  <td>Optinal Limit: {optionalLimit}</td>
                  <td>Start Time: {startTime}</td>
                  <td>Has Synced: {synced?.toString()}</td>
                </tr>
                <tr>
                  <td>Test Purpose: {purpose}</td>
                  <td>Is Enabled: {isEnabled?.toString()}</td>
                  <td>End Time: {endTime}</td>
                  <td>Repeat Schedule: {repeatSchedule?.type}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      )}
      {isModalVisible && (
        <section
          className={`fixed  inset-0 w-screen bg-gray-400/40 backdrop-blur-md`}
        >
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 rounded-md px-5 py-10 bg-white text-center ">
            <div className="relative">
              <div className="m-auto h-32 aspect-square rounded-full border-4 border-solid border-current border-r-transparent text-primary animate-spin " />
              <Check
                className=" text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                size={100}
              />
            </div>
            <p className="text-xl">{`Link Copied`}</p>
          </div>
        </section>
      )}
    </>
  );
};

export default TableRow;
