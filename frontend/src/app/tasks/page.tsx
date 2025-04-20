import Link from "next/link";

export default function TaskListPage() {
  return (
    <div>
      <h1>Available Tasks</h1>
      <ul>
        <li><Link href="/tasks/123">Job Example 1</Link></li>
        <li><Link href="/tasks/124">Job Example 2</Link></li>
      </ul>
    </div>
  );
}