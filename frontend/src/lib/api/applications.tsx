export async function fetchApplicationsForTask(taskId: number, token: string) {
	const res = await fetch(`http://localhost:8000/api/tasks/${taskId}/applications`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}
