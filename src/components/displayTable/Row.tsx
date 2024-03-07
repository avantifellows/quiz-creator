import React, { useState } from "react";
import NextLink from "next/link";
import { Copy, Edit, Link } from "react-feather";
import { DbTypes } from "@/types/ResponseTypes";
import { useRouter } from "next/router";

const TableRow = ({
  row,
  index,
  currentPage,
  itemsPerPage,
}: {
  row: DbTypes;
  index: number;
  currentPage: number;
  itemsPerPage: number;
}) => {
  const [isExpand, setIsExpand] = useState<boolean>(false);
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
  const startDate = new Date(start_time!).toLocaleDateString();
  const endDate = new Date(end_time!).toLocaleDateString();

  const startTime = new Date(start_time!).toLocaleTimeString();
  const endTime = new Date(end_time!).toLocaleTimeString();

  const actualIndex = currentPage * itemsPerPage + index + 1;

  return (
    <>
      <tr
        className={`${
          hasNoreportlink && `text-gray-400`
        } hover:bg-gray-50 border-none text-center`}
        onClick={() => setIsExpand(!isExpand)}
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
              <Link className="mx-auto" />
            </NextLink>
          )}
        </td>
        <td className="border-b border-black p-2">
          {typeof shortenedLink === "string" &&
            !hasNoId &&
            !hasNoportallink && (
              <NextLink href={shortenedLink} target="_blank">
                <Link className="mx-auto" />
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
        <td className="border-b border-black flex-wrap">
          <Copy className="cursor-pointer float-left" />
          <Edit
            className="cursor-pointer"
            onClick={(e) => {
              router.push(`/Session?type=edit&sessionId=${id}`);
              e.stopPropagation();
            }}
          />
        </td>
      </tr>

      {/* Collapsible Container */}
      {isExpand && (
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
    </>
  );
};

export default TableRow;
