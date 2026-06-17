import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

import { getMe } from "@/lib/api/serverApi";

import css from "./ProfilePage.module.css";

export default async function ProfilePage() {
  const cookieStore = await cookies();

  const user = await getMe(cookieStore.toString());

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile</h1>

          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt={user.username}
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <strong>Username:</strong>
            <span>{user.username}</span>
          </div>

          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </div>
    </main>
  );
}
