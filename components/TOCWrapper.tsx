"use client";

import { TableOfContents } from "./TableOfContents";
import { MobileTOC } from "./MobileTOC";

export function TOCWrapper() {
    return (
        <>
            <aside className="hidden xl:block w-64 shrink-0 hide-in-focus-mode">
                <div className="sticky top-24">
                    <TableOfContents />
                </div>
            </aside>
            <MobileTOC />
        </>
    );
}
