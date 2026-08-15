import { Course } from '../types/database';
import Link from 'next/link';

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="block bg-white border border-[#EDEAE3] rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="w-10 h-10 rounded-lg bg-[#FCEEE3] flex items-center justify-center mb-4">
        <span className="text-[#E86A33] font-semibold">
          {course.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <h3 className="font-semibold text-[#1C1C1E] text-lg truncate">
        {course.name}
      </h3>
      <p className="text-[#9A9A9A] text-sm mt-1">
        Created {new Date(course.created_at).toLocaleDateString()}
      </p>
    </Link>
  );
}