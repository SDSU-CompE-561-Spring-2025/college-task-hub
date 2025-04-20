export default function JobPostPage({ params }: { params: { id: string } }) {
    return (
      <div>
        <h1>Job Post</h1>
        <p>Job ID: {params.id}</p>
      </div>
    );
  }
