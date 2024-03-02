import React, { useState } from "react";
import NextLink from "next/link";
import { Copy, Edit, Link, Trash2 } from "react-feather";
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

  // console.log(id);
  const hasNoId = !id;
  const router = useRouter();
  const startDate = new Date(start_time!).toLocaleDateString();
  const endDate = new Date(end_time!).toLocaleDateString();

  const startTime = new Date(start_time!).toLocaleTimeString();
  const endTime = new Date(end_time!).toLocaleTimeString();

  const actualIndex = currentPage * itemsPerPage + index + 1;
  console.log({ currentPage, itemsPerPage });

  return (
    <>
      <tr
        className={`${hasNoId && `text-gray-400`} border text-center`}
        onClick={() => setIsExpand(!isExpand)}
      >
        <td className="border p-2">{actualIndex}</td>
        <td className="border p-2">{batch}</td>
        <td className="border p-2">{name}</td>
        <td suppressHydrationWarning className="border p-2">
          {startDate}
        </td>
        <td suppressHydrationWarning className="border p-2">
          {endDate}
        </td>
        <td className="border p-2">{testTakers}</td>
        <td className="border p-2">
          {typeof reportLink === "string" && !hasNoId && (
            <NextLink href={reportLink} target="_blank">
              <Link className="mx-auto" />
            </NextLink>
          )}
        </td>
        <td className="border p-2">
          {typeof shortenedLink === "string" && !hasNoId && (
            <NextLink href={shortenedLink} target="_blank">
              <Link className="mx-auto" />
            </NextLink>
          )}
        </td>
        <td className="border p-2">
          {typeof adminTestingLink === "string" && !hasNoId && (
            <NextLink href={adminTestingLink} target="_blank">
              <Link className="mx-auto" />
            </NextLink>
          )}
        </td>
        <td className="border p-2 flex gap-2 justify-center">
          <Copy className="cursor-pointer" />
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
        <tr className="bg-slate-100">
          <td colSpan={9}>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>Test_type: {type}</td>
                  <td>Test Takers Count: {testTakers}</td>
                  <td>date_created: {dateCreated}</td>
                  <td>infinite_session: {sessionType}</td>
                </tr>
                <tr>
                  <td>test_format: {format}</td>
                  <td>optinal_limit: {optionalLimit}</td>
                  <td>start_time: {startTime}</td>
                  <td>has_synced: {synced?.toString()}</td>
                </tr>
                <tr>
                  <td>test_purpose: {purpose}</td>
                  <td>is_enabled: {isEnabled?.toString()}</td>
                  <td>end_time: {endTime}</td>
                  <td>repeat_schedule: {repeatSchedule?.type}</td>
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
