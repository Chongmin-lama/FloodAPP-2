import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import bcrypt from "bcrypt";

// PUT - change user role
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const role = req.cookies.get("user_role")?.value;
    if (role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { role: newRole } = await req.json();

    if (!["citizen", "authority", "admin"].includes(newRole))
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });

    const pool = await getPool();
    await pool
      .request()
      .input("id", parseInt(params.id))
      .input("role", newRole)
      .query("UPDATE users SET role = @role WHERE id = @id");

    return NextResponse.json({ message: "Role updated" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH - reset password to default "floodguard"
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const role = req.cookies.get("user_role")?.value;
    if (role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const hashed = await bcrypt.hash("floodguard", 10);

    const pool = await getPool();
    await pool
      .request()
      .input("id", parseInt(params.id))
      .input("password", hashed)
      .query("UPDATE users SET password = @password WHERE id = @id");

    return NextResponse.json({ message: "Password reset to default" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const role = req.cookies.get("user_role")?.value;
    const currentUserId = req.cookies.get("user_id")?.value;

    console.log(
      "Current user ID:",
      params.id,
      "Cookie user ID:",
      currentUserId
    );

    if (role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (currentUserId === params.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const pool = await getPool();
    const transaction = pool.transaction();

    await transaction.begin();

    try {
      const request = transaction.request();

      await request
        .input("id", parseInt(params.id))
        .query(`
          DELETE FROM reports
          WHERE user_id = @id;

          DELETE FROM users
          WHERE id = @id;
        `);

      await transaction.commit();

      return NextResponse.json({ message: "User deleted" });

    } catch (err) {
      await transaction.rollback();
      throw err;
    }

  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
